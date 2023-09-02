import * as fflate from "fflate";

export const convertStrToUint8 = (str:string):Uint8Array => {
  return fflate.strToU8(str);
}

export const getSampleZipBlob = ():Uint8Array => {
  return fflate.zipSync({
    // Directories can be nested structures, as in an actual filesystem
    'dir1': {
      'nested': {
        // You can use Unicode in filenames
        'hello.txt': fflate.strToU8('Hey there!')
      },
      // You can also manually write out a directory path
      'other/tmp.txt': new Uint8Array([97, 98, 99, 100])
    },
  });
}

export const getZipBlob = (filepathContentMap:{[k:string]: any}):Uint8Array => {
  return fflate.zipSync(filepathContentMap);
}