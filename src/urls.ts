import { globalMirrors, CNMirrors } from './mirrors'

export function getGlobalURLs (
  name: string,
  version: string | undefined,
  path: string
): string[] {
  return globalMirrors.map((host) => host + getSuffix(name, version, path))
}

export function getCNURLs (
  name: string,
  version: string | undefined,
  path: string
): string[] {
  return CNMirrors.map((host) => host + getSuffix(name, version, path))
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
