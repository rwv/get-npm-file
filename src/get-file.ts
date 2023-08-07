import { getGlobalURLs, getCNURLs, getCacheURL } from './urls'

const cacheName = 'get-npm-file'

export async function getNPMFile (
  name: string,
  version: string | undefined,
  path: string,
  options?: {
    cache?: boolean | undefined
    china?: boolean | undefined
    fetchOptions?: RequestInit
  }
): Promise<{
    blob: Blob
    url: string
    response: Response
  }> {
  // look up in cache
  if (options?.cache !== false) {
    try {
      const cache = await caches.open(cacheName)
      const url = getCacheURL(name, version, path)
      const cachedResponse = await cache.match(url)
      if (cachedResponse != null) {
        const blob = await cachedResponse.blob()
        return { blob, url: cachedResponse.url, response: cachedResponse }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const controller = new AbortController()
  const signal = controller.signal
  if (options?.fetchOptions?.signal != null) {
    options.fetchOptions.signal.addEventListener('abort', () => {
      controller.abort()
    })
  }

  const urls = getGlobalURLs(name, version, path)

  const china = options?.china ?? navigator.language === 'zh-CN'
  if (china) {
    urls.push(...getCNURLs(name, version, path))
  }

  const fetchOptions = {
    ...options?.fetchOptions,
    signal,
    referrer: 'no-referrer',
    referrerPolicy: 'no-referrer',
    credentials: 'omit',
    mode: 'cors'
  } as const

  const blobPromises = urls.map(
    async (url) => await fetchBlob(url, fetchOptions)
  )

  const { blob, url, response } = await Promise.any(blobPromises)

  controller.abort()

  if (options?.cache !== false) {
    try {
      const cache = await caches.open(cacheName)
      const url = getCacheURL(name, version, path)

      void cache.put(
        url,
        new Response(blob, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        })
      )
    } catch (e) {
      console.error(e)
    }
  }

  return { blob, url, response }
}

async function fetchBlob (
  url: RequestInfo | URL,
  options?: RequestInit
): Promise<{
    blob: Blob
    url: string
    response: Response
  }> {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error('fetch failed')
  }

  const blob = await response.blob()
  return { blob, url: response.url, response }
}
