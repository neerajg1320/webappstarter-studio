import path from 'path';

export const replaceFilePart = (inputPath:string, fileName:string): string => {
  const dir = path.dirname(inputPath);

  return path.join(dir, fileName);
}

export const getFileNameFromPath = (inputPath:string): string => {
  return path.basename(inputPath);
}