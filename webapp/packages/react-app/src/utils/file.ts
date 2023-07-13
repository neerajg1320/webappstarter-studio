
export const createFileFromString = (fileContent: string, fileName:string):File => {
  // Note the first arg is BlobPart[]. A BlobPart is (BufferSource | Blob | string)
  return new File([fileContent], fileName, {type: 'text/plain'});
}

export const readFileContent = (file:File):Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function() {
      console.log(`[${typeof reader.result}]`, reader.result);
      resolve(reader.result as string);
    };

    reader.onerror = function() {
      // console.log(reader.error);
      reject(reader.error);
    };
  });
}