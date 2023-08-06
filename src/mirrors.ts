export type Mirror = string | ((name: string, version: string | undefined, path: string) => string)

export const globalMirrors: Mirror[] = ['https://cdn.jsdelivr.net/npm']

export const CNMirrors: Mirror[] = [
  'https://npm.elemecdn.com',
  'https://jsd.cdn.zzko.cn/npm',
  'https://jsd.onmicrosoft.cn/npm',
  'https://jsdelivr.codeqihan.com/npm',
  'https://jsdelivr.b-cdn.net/npm'
]
