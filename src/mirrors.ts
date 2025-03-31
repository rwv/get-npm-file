export type Mirror = string | ((name: string, version: string | undefined, path: string) => string)

export const globalMirrors: Mirror[] = ['https://cdn.jsdelivr.net/npm']

export const CNMirrors: Mirror[] = [
  'https://jsd.cdn.zzko.cn/npm',
  'https://jsd.onmicrosoft.cn/npm',
  'https://cdn.jsdmirror.com/npm'
]
