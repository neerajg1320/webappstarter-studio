export type PackageInfo = {
  name: string,
  importPath: string,
  version: string,
  entry: string,
  url: string
}

export type PackageMap = {
  [k:string]: PackageInfo
}