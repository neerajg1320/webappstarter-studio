import {
  isPathJavascript,
  isPathTypescript,
  isPathCss,
  isPathScss,
  isPathHtml,
  isPathJson,
  isPathText
} from "../utils/path";
import {BundleLanguage} from "./bundle";

export enum CodeLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  CSS = 'css',
  SCSS = 'scss',
  HTML = 'html',
  HTM = 'htm',
  TEXT = 'txt',
  JSON = 'json',
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
  } else if (isPathJson(path)) {
    return CodeLanguage.JSON
  } else if (isPathText(path)) {
    return CodeLanguage.TEXT
  }

  return CodeLanguage.UNKNOWN;
}