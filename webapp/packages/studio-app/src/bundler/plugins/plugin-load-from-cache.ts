import localforage from "localforage";
import {enableLoadFromCache, debugCache, debugPlugin} from "../../config/global";
import * as esbuild from "esbuild-wasm";

let loadResultCache: LocalForage;

if (enableLoadFromCache) {
  loadResultCache = localforage.createInstance({
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
        const loadResult = await getLoadResultFromIndexDBCache(args.path);
        if (loadResult) {
          if (debugPlugin || false) {
            console.log(`cache.onLoad(): path:${args.path.padEnd(70)}  namespace:${args.namespace.padEnd(80)}`);
          }
        }
        return loadResult;
      });
    }
  }
}

export const getLoadResultFromIndexDBCache = async (url:string):Promise<esbuild.OnLoadResult> => {
  if (enableLoadFromCache) {
    const cachedResult = await loadResultCache.getItem<esbuild.OnLoadResult>(url);
    if (cachedResult) {
      if (debugPlugin || debugCache) {
        console.log(`loaded ${url} from cache`);
      }
      return cachedResult;
    }
  }
}

export const setLoadResultInIndexDBCache = async (url:string, loadResult:esbuild.OnLoadResult) => {
  if (enableLoadFromCache) {
    // Store result in cache
    await loadResultCache.setItem(url, loadResult);
    if (debugPlugin || debugCache) {
      console.log(`stored ${url} to cache`);
    }
  }
}