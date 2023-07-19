import path from 'path';

export const replaceFilePart = (inputPath:string, fileName:string): string => {
  const dir = path.dirname(inputPath);

  return path.join(dir, fileName);
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

export const getCopyBasename = (inputPath:string): string => {
  const {dirname, basename} = getFilePathParts(inputPath);
  const {name, ext} = getFileBasenameParts(basename)
  return path.join(dirname, [name + '1',ext].join('.'));
}
