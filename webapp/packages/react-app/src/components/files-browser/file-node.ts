import {ReduxFile} from "../../state";

export type FileType = "folder" | "file";
export type FileInfo = {type: FileType, name: string, parentNode: FileNode|null};
export type FileNode = {info: FileInfo, childrenFileNodeMap?: {[k:string]:FileNode}};


// Used in console.log
// This is not the traversal function used by ExpansionSpan component
export const safeFileNodeTraveral = (key:string, value:FileNode) => {
  if (key === "parentNode") {
    if (value != null) {
      return value.info.name;
    }
  }
  return value;
};

// Hard coded fileTree generated for testing the compoent
export const getSampleFileTree = (title:string="root"):FileNode => {
  // Create root folder
  const rootInfo:FileInfo = {type:"folder", name:`${title}`, parentNode:null};
  const rootNode:FileNode = {info:rootInfo, childrenFileNodeMap:{}};

  // Create src folder and make it child of root
  const srcInfo:FileInfo = {type:"folder", name:`src`, parentNode:rootNode};
  const srcNode:FileNode = {info:srcInfo, childrenFileNodeMap:{}};
  if (rootNode.childrenFileNodeMap) {
    rootNode.childrenFileNodeMap[srcInfo.name] = srcNode;
  }


  // Create styles folder and make it child of root
  const stylesInfo:FileInfo = {type:"folder", name:`styles`, parentNode:rootNode};
  const stylesNode:FileNode = {info:stylesInfo, childrenFileNodeMap:{}};
  if (rootNode.childrenFileNodeMap) {
    rootNode.childrenFileNodeMap[stylesInfo.name] = stylesNode;
  }

  // Create index.css and make it child of styles
  const indexCssNode:FileNode = {info: {type:"file", name:`index.css`, parentNode:stylesNode}}
  if (stylesNode.childrenFileNodeMap) {
    stylesNode.childrenFileNodeMap[indexCssNode.info.name] = indexCssNode;
  }

  // Create index.js and make it child of src
  const indexJsNode:FileNode = {info: {type:"file", name:`index.js`, parentNode:srcNode}}
  if (srcNode.childrenFileNodeMap) {
    srcNode.childrenFileNodeMap[indexJsNode.info.name] = indexJsNode;
  }

  // Create app.js and make it child of src
  const appJsNode:FileNode = {info: {type:"file", name:`app.js`, parentNode:srcNode}}
  if (srcNode.childrenFileNodeMap) {
    srcNode.childrenFileNodeMap[appJsNode.info.name] = (appJsNode);
  }

  // Create index.html and make it child of <root>
  const indexHtmlNode:FileNode = {info: {type:"file", name:`index.html`, parentNode:srcNode}}
  if (rootNode.childrenFileNodeMap) {
    rootNode.childrenFileNodeMap[indexHtmlNode.info.name] = (indexHtmlNode);
  }

  return rootNode;
}


// Create a fileTree out of ReduxFile[]. We use the file.path to construct the tree
export const getFileTreeFromReduxFileList = (title:string, reduxFiles: ReduxFile[]):FileNode => {
  const filePaths = reduxFiles.map(file => file.path)

  const rootFileNode:FileNode = {info: {type:"folder", name:title, parentNode:null}, childrenFileNodeMap:{}};

  filePaths.forEach((filePath) => {
    const pathParts = filePath.split("/");
    let currentNode = rootFileNode;

    pathParts.forEach((part, index) => {
      // if (!currentNode[part]) {
      //   if (index === pathParts.length - 1) {
      //     // If it's the last part, this is a file
      //     currentNode[part] = null;
      //   } else {
      //     // If it's not the last part, this is a directory
      //     currentNode[part] = {};
      //   }
      // }
      //
      // currentNode = currentNode[part];
    });
  });

  return getSampleFileTree(title);
}