export type BundleInputType = 'cell' | 'project';

export enum BundleLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  UNKNOWN = 'unknown',
}

export const stringToLanguage = (language:string): BundleLanguage => {
  return BundleLanguage[language as keyof typeof BundleLanguage] || BundleLanguage.UNKNOWN
}

// https://stackoverflow.com/questions/17380845/how-do-i-convert-a-string-to-enum-in-typescript

// export const languageToString = (bundleLanguage: BundleLanguage): string => {
//   return BundleLanguage[bundleLanguage];
// }