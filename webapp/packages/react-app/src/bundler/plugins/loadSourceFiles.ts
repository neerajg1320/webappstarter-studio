import * as esbuild from "esbuild-wasm";
import {axiosInstance} from "../../api/axiosApi";
import {setFileInCache} from "./plugin-load-from-cache";
import {isPathTypescript} from "../../utils/path";
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

export const loadCssUrl = async (url:string, isCached:boolean):Promise<esbuild.OnLoadResult> => {
  // Fetch the package from repo
  const {data, request} = await axiosInstance.get(url);

  const contents = wrapScriptOnCssContent(data);

  const result: esbuild.OnLoadResult = {
    loader: 'jsx',
    contents,
    resolveDir: new URL('./', request.responseURL).pathname
  }

  if (isCached) {
    await setFileInCache(url, result);
  }

  return result;
}

export const loadScriptUrl = async (url:string, isCached:boolean):Promise<esbuild.OnLoadResult> => {
  let result: esbuild.OnLoadResult = {
    loader: isPathTypescript(url) ? 'tsx' : 'jsx'
  };

  // Note we are parsing the request as well to get the path of the downloaded file which might be
  // different from the args.path
  const { data, request } = await axiosInstance.get(url);

  if (debugPlugin) {
    console.log(`request.responseURL:${request.responseURL}`);
  }

  result.contents = data;
  result.resolveDir = new URL('./', request.responseURL).pathname;

  if (isCached) {
    await setFileInCache(url, result);
  }

  if (debugPlugin && false) {
    console.log(`onLoad: for '${url}' returned `, result);
  }
  return result;
}
