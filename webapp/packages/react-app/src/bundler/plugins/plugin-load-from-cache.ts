import localforage from "localforage";
import {enableLoadFromCache, debugCache, debugPlugin} from "../../config/global";
import * as esbuild from "esbuild-wasm";

let fileCache: LocalForage;

if (enableLoadFromCache) {
  fileCache = localforage.createInstance({
      name: 'fileCache'
  });
  if (debugCache) {
    console.log(`Initialized Cache on IndexDB`);
  }
}

export const pluginLoadFromCache = () => {
  return {
    name: 'fetch-from-cache-plugin',
    setup(build: esbuild.PluginBuild) {
      // Cache Check: Get from Cache if available
      build.onLoad({filter: /.*/}, async (args: esbuild.OnLoadArgs) => {
        // If we have already fetched this file then return from cache
        // We use args.path as key in the cache
        return await getFileFromCache(args.path);
      });
    }
  }
}

export const getFileFromCache = async (url:string) => {
  if (enableLoadFromCache) {
    const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(url);
    if (cachedResult) {
      if (debugPlugin || debugCache) {
        console.log(`loaded ${url} from cache`);
      }
      return cachedResult;
    }
  }
}

export const setFileInCache = async (url:string, contents:esbuild.OnLoadResult) => {
  if (enableLoadFromCache) {
    // Store result in cache
    await fileCache.setItem(url, contents);
    if (debugPlugin || debugCache) {
      console.log(`stored ${url} to cache`);
    }
  }
}