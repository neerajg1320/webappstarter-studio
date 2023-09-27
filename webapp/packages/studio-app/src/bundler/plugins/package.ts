type Package = {
  name: string,
  version: string,
  url: string,
  responseURL: string
}

export type PackageInfo = Package & {
  importerURL: string,
  importPath: string,
}

export type ImporterInfo = {
  url: string,
  importPath: string
}

export type PackageEntry = Package & {
  importers: ImporterInfo[]
}

export type PackageMap = {
  [k:string]: PackageEntry
}