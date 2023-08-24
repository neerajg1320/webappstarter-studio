import * as esbuild from "esbuild-wasm";
import {axiosInstance} from "../../api/axiosApi";
import {setFileInCache} from "./plugin-load-from-cache";
import {getFileType} from "../../utils/path";
import {debugPlugin} from "../../config/global";

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

export const loadData = (data:string, contentType:string|null):esbuild.OnLoadResult => {
  let contents = data;
  if (contentType === "css") {
    contents = wrapScriptOnCssContent(data);
  }

  const result: esbuild.OnLoadResult = {
    loader: (contentType === "css") ? 'jsx' : (contentType === "ts") ? 'tsx' : 'jsx',
    contents,
  }
  return result;
}


export const loadFileUrl = async (url:string, isCached:boolean):Promise<esbuild.OnLoadResult> => {
  const contentType = getFileType(url);

  // Note we are parsing the request as well to get the path of the downloaded file which might be
  // different from the args.path
  const { data, request } = await axiosInstance.get(url);

  if (debugPlugin) {
    console.log(`request.responseURL:${request.responseURL}`);
  }

  const result = loadData(data, contentType);
  // Keeping resolveDir is important
  result.resolveDir = new URL('./', request.responseURL).pathname;

  if (request.responseURL !== url) {
    if (debugPlugin) {
      console.log(`INFO: url:${url} <not equal> responseUrl:${request.responseURL}`);
    }
  }

  if (isCached) {
    await setFileInCache(url, result);
  }

  return result;
}
