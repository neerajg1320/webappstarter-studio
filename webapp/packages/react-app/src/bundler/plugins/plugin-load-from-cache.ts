import localforage from "localforage";
import {cacheEnabled, debugCache, debugPlugin} from "../../config/global";
import * as esbuild from "esbuild-wasm";

let fileCache: LocalForage;

if (cacheEnabled) {
  fileCache = localforage.createInstance({
      name: 'fileCache'
  });
  if (debugCache) {
    console.log(`Initialized Cache on IndexDB`);
  }
}

export const pluginLoadFromCache = () => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      // Cache Check: Get from Cache if available
      // This checks if the file is in the cache. If present then returns the cached result.
      // If not then it returns nothing. This forces the esbuild to look at subsequent onLoad handlers.
      build.onLoad({filter: /.*/}, async (args: any) => {
        // If we have already fetched this file then return from cache
        // We use args.path as key in the cache
        if (cacheEnabled) {
          const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
          if (cachedResult) {
            if (debugPlugin) {
              console.log(`loaded ${args.path} from cache`);
            }
            return cachedResult;
          }
        }
      });
    }
  }
}

export const setFileInCache = async (file:string, contents:esbuild.OnLoadResult) => {
  if (cacheEnabled) {
    // Store result in cache
    await fileCache.setItem(file, contents);
    if (debugPlugin) {
      console.log(`stored ${file} to cache`);
    }
  }
}