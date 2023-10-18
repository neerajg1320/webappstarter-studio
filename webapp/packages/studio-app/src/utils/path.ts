import path from 'path';
import {getRegexMatches, isRegexMatch} from "./regex";
import {
  CSS_REGEX,
  JAVASCRIPT_REGEX,
  SCSS_REGEX,
  TYPESCRIPT_REGEX,
  HTML_REGEX,
  HTM_REGEX,
  JSON_REGEX,
  TEXT_REGEX, SVG_REGEX
} from "./patterns";

export const replaceFilePart = (inputPath:string, fileName:string): string => {
  const dir = path.dirname(inputPath);

  return path.join(dir, fileName);
}

export const getFileDir = (inputPath:string): string => {
  return path.dirname(inputPath);
}

export const getFileNameFromPath = (inputPath:string): string => {
  return path.basename(inputPath);
}

export const getFilePathParts = (inputPath:string): {basename: string, dirname: string} => {
  return {
    dirname: path.dirname(inputPath),
    basename: path.basename(inputPath)
  };
}

export const joinFileParts = (dirname:string, basename:string): string => {
  return path.join(dirname, basename);
}

// if '.' then return ""
// validatePath if not '.'
export const validatePath = (path:string):string => {
  // console.log(`validatePath: path:`, path)

  let newPath = path;
  if (path && path.length > 0) {
    if (path === ".") {
      newPath = "";
    } else if (path[path.length-1] !== '/') {
      newPath = path + '/';
    }
  }
  return newPath;
}

export const hasTrailingSlash = (path:string):boolean => {
  return isRegexMatch(/^.*\/$/, path);
}

// The ext contains the extension without preceding dot (.)
export const getFileBasenameParts = (inputName:string): {name:string, ext:string} => {
  const parts = inputName.split('.');
  let name:string;
  let ext:string;

  if (parts.length > 1) {
    ext = parts.pop()!;
    name = parts.join('.')
  } else {
    name = parts[0];
    ext = '';
  }

  return {name, ext};
}

// If path is 'src/index.js' then we will get 'index'
export const getFileBasenameFromPath = (path:string) => {
  const {name, ext} = getFileBasenameParts(getFileNameFromPath(path));
  return name;
}

// If path is 'src/index.js' then we will get 'js'
export const getFileTypeFromPath = (path:string) => {
  const {name, ext} = getFileBasenameParts(getFileNameFromPath(path));
  return ext;
}

export const getPathWithoutExtension = (path:string) => {
  const {dirname, basename} = getFilePathParts(path);
  const {name} = getFileBasenameParts(basename)

  return joinFileParts(dirname, name);
}

export const getImportLookupPath = (path:string) => {
  const {dirname, basename} = getFilePathParts(path);
  const {name, ext} = getFileBasenameParts(basename)

  if (['js', 'jsx', 'ts', 'tsx'].includes(ext)) {
    if (name === 'index') {
      return dirname;
    }

    return joinFileParts(dirname, name);
  }

  return path;
}

export const getCopyPath = (inputPath:string): string => {
  const {dirname, basename} = getFilePathParts(inputPath);
  const {name, ext} = getFileBasenameParts(basename)

  console.log(`getCopyPath: ${dirname}  ${basename}  ${name}  ${ext}`);

  let alphaPart = name;
  let numPart = 0;
  if (isRegexMatch(/^.*\d+$/, name)) {
    const matches = getRegexMatches(/^(.*)(\d+)$/, name)
    if (matches) {
      // console.log(matches);
      // matches[0] is the full match
      alphaPart = matches[1];
      numPart = parseInt(matches[2]);
    }
  }
  return path.join(dirname, [`${alphaPart}${numPart + 1}`,ext].join('.'));
}

export const isPathJavascript = (path: string): boolean => {
  return isRegexMatch(JAVASCRIPT_REGEX, path);
}
export const isPathTypescript = (path: string): boolean => {
  return isRegexMatch(TYPESCRIPT_REGEX, path);
}

export const isPathCss = (path: string): boolean => {
  return isRegexMatch(CSS_REGEX, path);
}

export const isPathHtml = (path: string): boolean => {
  return isRegexMatch(HTML_REGEX, path);
}

export const isPathJson = (path: string): boolean => {
  return isRegexMatch(JSON_REGEX, path);
}

export const isPathText = (path: string): boolean => {
  return isRegexMatch(TEXT_REGEX, path);
}

export const isPathHtm = (path: string): boolean => {
  return isRegexMatch(HTM_REGEX, path);
}

export const isPathSvg = (path: string): boolean => {
  return isRegexMatch(SVG_REGEX, path);
}

export const isPathScss = (path: string): boolean => {
  return isRegexMatch(SCSS_REGEX, path);
}

export const getFileType = (path:string): string|null => {
  if (isPathSvg(path)) {
    return "svg";
  }

  if (isPathScss(path)) {
    return "scss";
  }

  if (isPathCss(path)) {
    return "css";
  }

  if (isPathTypescript(path)) {
    return "ts";
  }

  if (isPathJavascript(path)) {
    return "js";
  }

  return null;
}

export enum FileContentType {
  TEXT = 'text',
  IMAGE = 'image',
  PDF = 'pdf',
  CODE = 'code',
  UNKNOWN = 'unknown',
}

export const getFileContentType = (path:string):FileContentType => {
  const fileExtn = getFileTypeFromPath(path).toLowerCase();
  // console.log(`getFileContentType(): fileExtn:`, fileExtn);
  
  if (['bmp', 'jpeg', 'jpg', 'png'].includes(fileExtn)) {
    return FileContentType.IMAGE;
  }

  if (['pdf', 'xpdf'].includes(fileExtn)) {
    return FileContentType.PDF;
  }

  if (['js', 'html', 'css', 'jsx', 'ts', 'tsx'].includes(fileExtn)) {
    return FileContentType.CODE;
  }

  if (['text', 'txt', 'log'].includes(fileExtn)) {
    return FileContentType.CODE;
  }

  if (['json'].includes(fileExtn)) {
    return FileContentType.CODE;
  }

  if (['svg'].includes(fileExtn)) {
    return FileContentType.CODE;
  }

  return FileContentType.UNKNOWN
}