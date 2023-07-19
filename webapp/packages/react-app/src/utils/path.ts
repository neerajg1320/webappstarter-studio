import path from 'path';

export const replaceFilePart = (inputPath:string, fileName:string): string => {
  const dir = path.dirname(inputPath);

  return path.join(dir, fileName);
}

export const getFileNameFromPath = (inputPath:string): string => {
  return path.basename(inputPath);
}

export const getFileParts = (inputPath:string): {basename: string, dirname: string} => {
  return {
    dirname: path.dirname(inputPath),
    basename: path.basename(inputPath)
  };
}

export const getCopyBasename = (inputPath:string): string => {
  return 'new.js';
}

export const joinFileParts = (dirname:string, basename:string): string => {
  return path.join(dirname, basename);
}