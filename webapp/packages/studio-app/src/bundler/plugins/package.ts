export type PackageInfo = {
  name: string,
  version: string,
  entry: string,
  url: string
}

export type PackageMap = {
  [k:string]: PackageInfo
}