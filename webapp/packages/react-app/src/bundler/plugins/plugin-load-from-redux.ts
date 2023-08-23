import * as esbuild from "esbuild-wasm";
import {debugPlugin} from "../../config/global";

export const pluginLoadFromRedux = (fileFetcher: (path:string) => esbuild.OnLoadResult) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      // Cache Check: Get from Cache if available
      // This checks if the file is in the cache. If present then returns the cached result.
      // If not then it returns nothing. This forces the esbuild to look at subsequent onLoad handlers.
      build.onLoad({filter: /.*/}, async (args: esbuild.OnLoadArgs) => {
        // If we have already fetched this file then return from cache
        // We use args.path as key in the cache

        const result = fileFetcher(args.path)
        if (result.loader === "json") {
          return result;
        }
      });
    }
  }
}