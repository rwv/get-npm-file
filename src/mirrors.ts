export type Mirror = string | ((name: string, version: string | undefined, path: string) => string)

export const globalMirrors: Mirror[] = ['https://cdn.jsdelivr.net/npm']

export const CNMirrors: Mirror[] = [
  'https://npm.elemecdn.com',
  npmmirror,
  'https://jsd.cdn.zzko.cn/npm',
  'https://jsd.onmicrosoft.cn/npm',
  'https://jsdelivr.codeqihan.com/npm',
  'https://jsdelivr.b-cdn.net/npm'
]

// npmmirror
// https://github.com/cnpm/cnpmcore/issues/452
// https://www.zhihu.com/question/62938096
function npmmirror (name: string, version: string | undefined, path: string): string {
  if (version !== undefined) {
    return `https://registry.npmmirror.com/${name}/${version}/files/${path}`
  } else {
    return `https://registry.npmmirror.com/${name}/latest/files/${path}`
  }
}
