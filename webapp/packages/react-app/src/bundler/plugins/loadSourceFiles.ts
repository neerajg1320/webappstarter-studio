import * as esbuild from "esbuild-wasm";
import {axiosInstance} from "../../api/axiosApi";
import {setFileInCache} from "./plugin-load-from-cache";
import {isPathTypescript} from "../../utils/path";
import {debugPlugin} from "../../config/global";

export const loadCssUrl = async (url:string):Promise<esbuild.OnLoadResult> => {
  // Fetch the package from repo
  const {data, request} = await axiosInstance.get(url);

  // start: The custom part for css
  const escapedCssStr = data
      .replace(/\n/g, '')
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'" )

  const contents = `
            const style = document.createElement('style');
            style.innerText = '${escapedCssStr}';
            document.head.appendChild(style);
            `;
  // end

  const result: esbuild.OnLoadResult = {
    loader: 'jsx',
    contents,
    resolveDir: new URL('./', request.responseURL).pathname
  }

  await setFileInCache(url, result);

  return result;
}

export const loadScriptUrl = async (url:string):Promise<esbuild.OnLoadResult> => {
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

  await setFileInCache(url, result);

  if (debugPlugin && false) {
    console.log(`onLoad: for '${url}' returned `, result);
  }
  return result;
}
