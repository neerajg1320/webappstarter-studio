import * as esbuild from "esbuild-wasm";
import {axiosInstance} from "../../api/axiosApi";
import {getFileFromCache, setFileInCache} from "./plugin-load-from-cache";
import {getFileType} from "../../utils/path";
import {debugCache, debugPlugin, enableLoadFromCache} from "../../config/global";

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

export const getLoadResult = (data:string, contentType:string|null):esbuild.OnLoadResult => {
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


// TBD: It should be called from redux only as we want to store the library files in redux as well
export const loadFileUrl= async (url:string, cacheEnabled:boolean):Promise<esbuild.OnLoadResult> => {
  const contentType = getFileType(url);

  // This is needed here as this function is called directly from redix.
  // We might remove it later as this is getting repeated
  // Also this check is not necessary as the file is already looked up in the load-from-cache-plugin
  if (cacheEnabled) {
    const cachedResult = await getFileFromCache(url);
    if (cachedResult) {
      return cachedResult
    }
  }
  // Note we are parsing the request as well to get the path of the downloaded file which might be
  // different from the args.path
  const { data, request } = await axiosInstance.get(url);

  if (debugPlugin) {
    console.log(`request.responseURL:${request.responseURL}`);
  }

  const result = getLoadResult(data, contentType);
  // Keeping resolveDir is important
  result.resolveDir = new URL('./', request.responseURL).pathname;

  if (request.responseURL !== url) {
    if (debugPlugin) {
      console.log(`INFO: url:${url} <not equal> responseUrl:${request.responseURL}`);
    }
  }

  if (cacheEnabled) {
    await setFileInCache(url, result);
  }

  return {result, responseURL: request.responseURL};
}

export interface LoadPackageFileResult {
  content: string,
  responseURL: string
}

export const loadPackgeFileUrl = async (url:string):Promise<LoadPackageFileResult> => {
  const { data, request } = await axiosInstance.get(url);

  return {content: data, responseURL: request.responseURL};
}

