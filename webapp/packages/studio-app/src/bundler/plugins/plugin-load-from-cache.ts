import localforage from "localforage";
import {enableLoadFromIndexDBCache, debugCache, debugPlugin} from "../../config/global";
import * as esbuild from "esbuild-wasm";

let loadResultIndexDBCache: LocalForage;

if (enableLoadFromIndexDBCache) {
  loadResultIndexDBCache = localforage.createInstance({
      name: 'fileCache'
  });
  if (debugCache) {
    console.log(`Initialized Cache on IndexDB`);
  }
}

export const getLoadResultFromIndexDBCache = async (url:string):Promise<esbuild.OnLoadResult> => {
  if (!loadResultIndexDBCache) {
    console.error(`Error! indexDB cache not initialized`);
  }

  const cachedResult = await loadResultIndexDBCache.getItem<esbuild.OnLoadResult>(url);
  if (cachedResult) {
    if (debugPlugin || debugCache) {
      console.log(`loaded ${url} from cache`);
    }
    return cachedResult;
  }
}

export const setLoadResultInIndexDBCache = async (url:string, loadResult:esbuild.OnLoadResult) => {
  if (!loadResultIndexDBCache) {
    console.error(`Error! indexDB cache not initialized`);
  }

  // Store result in cache
  await loadResultIndexDBCache.setItem(url, loadResult);
  if (debugPlugin || debugCache) {
    console.log(`stored ${url} to cache`);
  }
}