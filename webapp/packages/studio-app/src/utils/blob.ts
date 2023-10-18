export const createUrlFromContent = (content:any):string => {
  const contentBlob = new Blob([content]);
  return URL.createObjectURL(contentBlob);
}