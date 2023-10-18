import * as esbuild from "esbuild-wasm";
import {axiosInstance} from "../../api/axiosApi";
import {createUrlFromContent} from "../../utils/blob";
import {ReduxFile} from "../../state";

export const wrapScriptOnCssContent = (cssStr:string):string => {
  // start: The custom part for css
  const escapedCssStr = cssStr
      .replace(/\n/g, '')
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'" )

  return `
            const style = document.createElement('style');
            style.innerText = '${escapedCssStr}';
            document.head.appendChild(style);
            `;
}

export const createReactComponentFromSvg = (svg:string):string => {
  // console.log(`createReactComponentFromSvg: svg:`, svg);

  const componentCode = `
  const SvgComponent = () => {
    return (${svg});
  };
  export default SvgComponent;
  `;

  return componentCode;
}

export const createUrlFromSvg = (data:string):string => {
  return createUrlFromContent(data);
}

export const getLoadResult = (data:string, contentType:string|null, reduxFile?:ReduxFile):esbuild.OnLoadResult => {
  let contents = data;

  if (contentType === "css") {
    contents = wrapScriptOnCssContent(data);
  }

  // if (contentType === "svg") {
  //   if (reduxFile) {
  //     contents = reduxFile.file;
  //   } else {
  //     contents = createUrlFromSvg(data);
  //   }
  // }

  const result: esbuild.OnLoadResult = {
    loader: (contentType === "svg") ? 'dataurl' : (['ts', 'tsx'].includes(contentType)) ? 'tsx' : 'jsx',
    contents,
  }
  return result;
}

export interface LoadPackageFileResult {
  content: string,
  responseURL: string
}

export const loadPackgeFileUrl = async (url:string):Promise<LoadPackageFileResult> => {
  const { data, request } = await axiosInstance.get(url);

  return {content: data, responseURL: request.responseURL};
}

