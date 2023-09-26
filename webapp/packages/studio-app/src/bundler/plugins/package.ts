export type PackageInfo = {
  name: string,
  importPath: string,
  version: string,
  url: string,
  responseURL: string
}

export type PackageMap = {
  [k:string]: PackageInfo
}