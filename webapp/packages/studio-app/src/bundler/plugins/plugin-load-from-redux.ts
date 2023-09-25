import * as esbuild from "esbuild-wasm";
import {debugPlugin, serverMediaBaseUrl} from "../../config/global";

export const pluginLoadFromRedux = (fileFetcher: (path:string) => Promise<esbuild.OnLoadResult|null>) => {
  return {
    name: 'fetch-from-redux-plugin',
    setup(build: esbuild.PluginBuild) {
      // Load the files which are being fetched from api server
      build.onLoad({filter: /.*/}, async (args: any) => {
        if (args.path.includes(`${serverMediaBaseUrl}`)) {
          if (debugPlugin || true) {
            console.log(`redux.onLoad(): path:${args.path.padEnd(70)}  namespace:${args.namespace.padEnd(80)}`);
          }

          const result = await fileFetcher(args.path);
          if (debugPlugin) {
            console.log(`pluginLoadFromRedux: result:`, result);
          }
          if (result) {
            return result;
          }
        }
        // else {
        //   console.error(`${args.path} does not contain ${serverMediaBaseUrl}`);
        // }
      });

      // For debug purpose
      // build.onLoad({filter: /.*/}, async (args: any) => {
      //   console.log(`pluginLoadFromRedux:onLoad() not handled args=`, args);
      //   return undefined;
      // });
    }
  }
}