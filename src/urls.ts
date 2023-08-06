import { globalMirrors, CNMirrors, type Mirror } from './mirrors'

export function getCacheURL (
  name: string,
  version: string | undefined,
  path: string
): string {
  return getURL(globalMirrors[0], name, version, path)
}

export function getGlobalURLs (
  name: string,
  version: string | undefined,
  path: string
): string[] {
  return globalMirrors.map((mirror) => getURL(mirror, name, version, path))
}

export function getCNURLs (
  name: string,
  version: string | undefined,
  path: string
): string[] {
  return CNMirrors.map((mirror) => getURL(mirror, name, version, path))
}

function getURL (
  mirror: Mirror,
  name: string,
  version: string | undefined,
  path: string
): string {
  if (typeof mirror === 'function') {
    return mirror(name, version, path)
  } else {
    return mirror + getSuffix(name, version, path)
  }
}

function getSuffix (
  name: string,
  version: string | undefined,
  path: string
): string {
  if (version !== undefined) {
    return `/${name}@${version}/${path}`
  } else {
    return `/${name}/${path}`
  }
}
