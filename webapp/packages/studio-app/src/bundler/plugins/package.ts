export type PackageInfo = {
  name: string,
  version: string,
  url: string
}

export type PackageMap = {
  [k:string]: PackageInfo
}