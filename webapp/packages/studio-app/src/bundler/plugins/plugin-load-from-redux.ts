import * as esbuild from "esbuild-wasm";
import {debugPlugin, serverMediaBaseUrl} from "../../config/global";

export const pluginLoadFromRedux = (resultFetcher: (path:string) => Promise<esbuild.OnLoadResult|null>) => {
  return {
    name: 'plugin-load-from-redux',
    setup(build: esbuild.PluginBuild) {
      // Load the files which are being fetched from api server
      build.onLoad({filter: /.*/}, async (args: any) => {
        if (args.path.includes(`${serverMediaBaseUrl}`)) {
          if (debugPlugin || true) {
            console.log(`pluginLoadFromRedux.onLoad path:${args.path.padEnd(70)}  namespace:${args.namespace.padEnd(80)}`);
          }

          const result = await resultFetcher(args.path);
          if (debugPlugin) {
            console.log(`pluginLoadFromRedux: result:`, result);
          }
          if (result) {
            return result;
          }
        }
      });
    }
  }
}