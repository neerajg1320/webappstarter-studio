import {isPathJavascript, isPathTypescript} from "../utils/path";

export type BundleInputType = 'cell' | 'project';

export enum BundleLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  UNKNOWN = 'unknown',
}

export const stringToBundleLanguage = (language:string): BundleLanguage => {
  return BundleLanguage[language as keyof typeof BundleLanguage] || BundleLanguage.UNKNOWN
}

// export const bundleLanguageToString = (bundleLanguage: BundleLanguage): string => {
//   return BundleLanguage[bundleLanguage as BundleLanguage];
// }

export const pathToBundleLanguage = (path:string): BundleLanguage => {
  if (isPathTypescript(path)) {
    return BundleLanguage.TYPESCRIPT
  } else if (isPathJavascript(path)) {
    return BundleLanguage.JAVASCRIPT
  }

  return BundleLanguage.UNKNOWN;
}

// https://stackoverflow.com/questions/17380845/how-do-i-convert-a-string-to-enum-in-typescript

// export const languageToString = (bundleLanguage: BundleLanguage): string => {
//   return BundleLanguage[bundleLanguage];
// }