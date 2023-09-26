import * as esbuild from "esbuild-wasm";
import {debugPlugin, enableLoadFromCache} from "../../config/global";

import {loadFileUrl} from "./loadFile";
import {PackageMap} from "./package";

// TBD: This should be broken and a separate loader for cells should be created
export const pluginLoadFromServer = (pkgMap: PackageMap) => {
  return {
    name: 'fetch-from-server-plugin',
    setup(build: esbuild.PluginBuild) {          
      // onLoad are for loading the file.

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        if (debugPlugin || true) {
          console.log('onLoad', args);
        }
        const {result, responseURL} = await loadFileUrl(args.path, enableLoadFromCache)
        return result;
      });
    }
  }
}