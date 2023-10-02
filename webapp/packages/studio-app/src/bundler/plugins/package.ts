export type PackageDependency = {
  name: string,
  version: string,
}

type Package = PackageDependency & {
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

export type PackageDetectResult = {
  url: string,
  name: string,
  version: string,
}