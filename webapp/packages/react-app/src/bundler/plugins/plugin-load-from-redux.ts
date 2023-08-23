import * as esbuild from "esbuild-wasm";
import {debugPlugin} from "../../config/global";

export const pluginLoadFromRedux = (fileFetcher: (path:string) => Promise<string|null>) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      // Cache Check: Get from Cache if available
      // This checks if the file is in the cache. If present then returns the cached result.
      // If not then it returns nothing. This forces the esbuild to look at subsequent onLoad handlers.
      // We use any instead of esbuild.OnLoadArgs for args as we also put resolveDir in it
      build.onLoad({filter: /.*/}, async (args: any) => {
        // If we have already fetched this file then return from cache
        // We use args.path as key in the cache
        console.log(`pluginLoadFromRedux:onLoad() args=`, args);

        const contents = await fileFetcher(args.path);
        if (debugPlugin) {
          // console.log(`pluginLoadFromRedux: contents:`, contents);
        }

        if (contents) {
          return {
            loader:  "jsx",
            contents,
            resolveDir: new URL('./', args.path).pathname
          }
        }
      });
    }
  }
}