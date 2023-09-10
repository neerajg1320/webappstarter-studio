import path from 'path';
import {getRegexMatches, isRegexMatch} from "./regex";
import {CSS_REGEX, JAVASCRIPT_REGEX, SCSS_REGEX, TYPESCRIPT_REGEX} from "./patterns";

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

export const isPathScss = (path: string): boolean => {
  return isRegexMatch(SCSS_REGEX, path);
}

export const getFileType = (path:string): string|null => {
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