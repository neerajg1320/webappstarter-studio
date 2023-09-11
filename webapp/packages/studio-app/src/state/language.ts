import {isPathJavascript, isPathTypescript, isPathCss, isPathScss, isPathHtml} from "../utils/path";
import {BundleLanguage} from "./bundle";

export enum CodeLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  CSS = 'css',
  SCSS = 'scss',
  HTML = 'html',
  HTM = 'htm',
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
  } else if (isPathHtml(path)) {
    return CodeLanguage.HTML
  } else if (isPathHtml(path)) {
    return CodeLanguage.HTM
  }

return CodeLanguage.UNKNOWN;
}