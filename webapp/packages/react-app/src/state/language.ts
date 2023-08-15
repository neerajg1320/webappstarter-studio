import {isPathJavascript, isPathTypescript, isPathCss, isPathScss} from "../utils/path";
import {BundleLanguage} from "./bundle";

export enum CodeLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  CSS = 'css',
  SCSS = 'scss',
  UNKNOWN = 'unknown',
}

export const stringToCodeLanguage = (language:string): CodeLanguage => {
  return CodeLanguage[language as keyof typeof BundleLanguage] || CodeLanguage.UNKNOWN
}


export const pathToCodeLanguage = (path:string): CodeLanguage => {
  if (isPathTypescript(path)) {
    return CodeLanguage.TYPESCRIPT
  } else if (isPathJavascript(path)) {
    return CodeLanguage.JAVASCRIPT
  } else if (isPathCss(path)) {
    return CodeLanguage.CSS
  } else if (isPathScss(path)) {
    return CodeLanguage.SCSS
  }

  return CodeLanguage.UNKNOWN;
}