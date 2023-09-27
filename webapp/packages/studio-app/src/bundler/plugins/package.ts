type Package = {
  name: string,
  version: string,
  url: string,
  responseURL: string
}

export type PackageInfo = Package & {
  importPath: string,
}

export type PackageEntry = Package & {
  importPaths: string[]
}

export type PackageMap = {
  [k:string]: PackageEntry
}