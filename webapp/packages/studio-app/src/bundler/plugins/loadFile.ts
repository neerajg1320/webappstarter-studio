import * as esbuild from "esbuild-wasm";
import {axiosInstance} from "../../api/axiosApi";

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
  console.log(`createReactComponentFromSvg: svg:`, svg);
  return svg;
}

export const getLoadResult = (data:string, contentType:string|null):esbuild.OnLoadResult => {
  if (contentType === "svg") {
    console.log(`getLoadResult: got svg`);
  }

  let contents = data;
  if (contentType === "css") {
    contents = wrapScriptOnCssContent(data);
  }

  if (contentType === "svg") {
    contents = createReactComponentFromSvg(data);
  }

  const result: esbuild.OnLoadResult = {
    loader: (contentType === "css") ? 'jsx' : (['ts', 'tsx'].includes(contentType)) ? 'tsx' : 'jsx',
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

