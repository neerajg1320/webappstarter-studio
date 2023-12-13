import {ReduxFile} from "../../state";
import {debugFileTree} from "../../config/global";

export type FileType = "folder" | "file";

// 2023-09-08: Currently folders do not have reduxFile assciated to them only files have
// name has a part of the path. e.g. project/src/index.html will have three node with names: project, src. index.html
// projectNode = {info: {type: "folder", name: "project", parentNode:null}, childrenFileNodeMap:{'src': srcNode}}
// srcNode = {info: {type: "folder", name: "src", parentNode:projectNode}, childrenFileNodeMap:{'index.html': indexHtmlNode}}
// indexHtmlNode = {info: {type: "file", name: "index.html", reduxFile: <reduxFile{path:src/index.html}>, parentNode:srcNode}}}
export type FileInfo = {type: FileType, name: string, reduxFile?:ReduxFile, parentNode: FileReduxNode|null, rootNamePath?:string[]};

// Note: FileReduxNode is a cyclical structure. To use it with console.log we have to use safeFileNodeTravesral as
// e.g. JSON.stringify(fileNode, safeFileNodeTraveral, 2)
export type FileReduxNode = {info: FileInfo, childrenFileNodeMap?: {[k:string]:FileReduxNode}};


// Used in console.log
// This is not the traversal function used by ExpansionSpan component
export const safeFileNodeTraveral = (key:string, value:FileReduxNode) => {
  if (key === "parentNode") {
    if (value != null) {
      return value.info.name;
    }
  }
  return value;
};

// Hard coded fileTree generated for testing the compoent
export const getSampleFileTree = (title:string="root"):FileReduxNode => {
  // Create root folder
  const rootInfo:FileInfo = {type:"folder", name:`${title}`, parentNode:null};
  const rootNode:FileReduxNode = {info:rootInfo, childrenFileNodeMap:{}};

  // Create src folder and make it child of root
  const srcInfo:FileInfo = {type:"folder", name:`src`, parentNode:rootNode};
  const srcNode:FileReduxNode = {info:srcInfo, childrenFileNodeMap:{}};
  if (rootNode.childrenFileNodeMap) {
    rootNode.childrenFileNodeMap[srcInfo.name] = srcNode;
  }


  // Create styles folder and make it child of root
  const stylesInfo:FileInfo = {type:"folder", name:`styles`, parentNode:rootNode};
  const stylesNode:FileReduxNode = {info:stylesInfo, childrenFileNodeMap:{}};
  if (rootNode.childrenFileNodeMap) {
    rootNode.childrenFileNodeMap[stylesInfo.name] = stylesNode;
  }

  // Create index.css and make it child of styles
  const indexCssNode:FileReduxNode = {info: {type:"file", name:`index.css`, parentNode:stylesNode}}
  if (stylesNode.childrenFileNodeMap) {
    stylesNode.childrenFileNodeMap[indexCssNode.info.name] = indexCssNode;
  }

  // Create index.js and make it child of src
  const indexJsNode:FileReduxNode = {info: {type:"file", name:`index.js`, parentNode:srcNode}}
  if (srcNode.childrenFileNodeMap) {
    srcNode.childrenFileNodeMap[indexJsNode.info.name] = indexJsNode;
  }

  // Create app.js and make it child of src
  const appJsNode:FileReduxNode = {info: {type:"file", name:`app.js`, parentNode:srcNode}}
  if (srcNode.childrenFileNodeMap) {
    srcNode.childrenFileNodeMap[appJsNode.info.name] = (appJsNode);
  }

  // Create index.html and make it child of <root>
  const indexHtmlNode:FileReduxNode = {info: {type:"file", name:`index.html`, parentNode:srcNode}}
  if (rootNode.childrenFileNodeMap) {
    rootNode.childrenFileNodeMap[indexHtmlNode.info.name] = (indexHtmlNode);
  }

  return rootNode;
}


// Create a fileTree out of ReduxFile[]. We use the file.path to construct the tree
export const getFileTreeFromReduxFileList = (title:string, reduxFiles: ReduxFile[]):FileReduxNode => {
  const rootFileNode:FileReduxNode = {info: {type:"folder", name:title, parentNode:null, rootNamePath:[title]}, childrenFileNodeMap:{}};

  if (debugFileTree) {
    console.log(`Created rootFileNode:`, JSON.stringify(rootFileNode, safeFileNodeTraveral, 2));
  }

  console.log("reduxFiles: ", reduxFiles)

  
  reduxFiles.forEach((reduxFile) => {
    const pathParts = reduxFile.path.split("/");
    let currentNode = rootFileNode;

    
    pathParts.forEach((part, index) => {
      if (!currentNode.childrenFileNodeMap) {
        console.log(`Error we should not be here part:${part} index:${index}`)
        currentNode.childrenFileNodeMap = {}
      }

      if (!currentNode.childrenFileNodeMap[part]) {
        let partNode:FileReduxNode;
        const commonInfo = {name:part, parentNode:currentNode, rootNamePath:[...(currentNode.info.rootNamePath || []), part]};

        if (index < pathParts.length - 1) {
          partNode = {info:{type:"folder", ...commonInfo}, childrenFileNodeMap:{}}
        } else {
          partNode = {info:{type:"file", ...commonInfo, reduxFile}}
        }

        if (debugFileTree) {
          console.log(`Created partNode:`, JSON.stringify(partNode, safeFileNodeTraveral, 2));
        }

        currentNode.childrenFileNodeMap[part] = partNode;
      }

      currentNode = currentNode.childrenFileNodeMap[part];

    });
  });

  // console.log("rootFileNode: ", rootFileNode);

  return rootFileNode;
}