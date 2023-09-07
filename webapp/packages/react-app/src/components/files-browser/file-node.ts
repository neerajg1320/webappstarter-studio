export type FileType = "folder" | "file";
export type FileInfo = {type: FileType, name: string, parent: FileNode|null};
export type FileNode = {info: FileInfo, childFileNodes?: FileNode[]};

export const getSampleFileTree = (title:string="root"):FileNode => {
  // Create root folder
  const rootInfo:FileInfo = {type:"folder", name:`${title}`, parent:null};
  const rootNode:FileNode = {info:rootInfo, childFileNodes:[]};

  // Create src folder and make it child of root
  const srcInfo:FileInfo = {type:"folder", name:`src`, parent:rootNode};
  const srcNode:FileNode = {info:srcInfo, childFileNodes:[]};
  if (rootNode.childFileNodes) {
    rootNode.childFileNodes.push(srcNode);
  }


  // Create styles folder and make it child of root
  const stylesInfo:FileInfo = {type:"folder", name:`styles`, parent:rootNode};
  const stylesNode:FileNode = {info:stylesInfo, childFileNodes:[]};
  if (rootNode.childFileNodes) {
    rootNode.childFileNodes.push(stylesNode);
  }

  // Create index.css and make it child of styles
  const indexCssNode:FileNode = {info: {type:"file", name:`index.css`, parent:stylesNode}}
  if (stylesNode.childFileNodes) {
    stylesNode.childFileNodes.push(indexCssNode);
  }

  // Create index.js and make it child of src
  const indexJsNode:FileNode = {info: {type:"file", name:`index.js`, parent:srcNode}}
  if (srcNode.childFileNodes) {
    srcNode.childFileNodes.push(indexJsNode);
  }

  // Create app.js and make it child of src
  const appJsNode:FileNode = {info: {type:"file", name:`app.js`, parent:srcNode}}
  if (srcNode.childFileNodes) {
    srcNode.childFileNodes.push(appJsNode);
  }

  // Create index.html and make it child of <root>
  const indexHtmlNode:FileNode = {info: {type:"file", name:`index.html`, parent:srcNode}}
  if (rootNode.childFileNodes) {
    rootNode.childFileNodes.push(indexHtmlNode);
  }

  return rootNode;
}