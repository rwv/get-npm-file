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
): Promise<Blob> {
  // look up in cache
  if (options?.cache !== false) {
    try {
      const cache = await caches.open(cacheName)
      const url = getCacheURL(name, version, path)
      const cachedResponse = await cache.match(url)
      if (cachedResponse != null) {
        return await cachedResponse.blob()
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

  const blobPromises = urls.map(async (url) => await fetchBlob(url, fetchOptions))

  const blob = await Promise.any(blobPromises)

  controller.abort()

  if (options?.cache !== false) {
    try {
      const cache = await caches.open(cacheName)
      const url = getCacheURL(name, version, path)
      void cache.put(url, new Response(blob))
    } catch (e) {
      console.error(e)
    }
  }

  return blob
}

async function fetchBlob (url: RequestInfo | URL, options?: RequestInit): Promise<Blob> {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error('fetch failed')
  }

  const blob = await response.blob()
  return blob
}
