import * as esbuild from "esbuild-wasm";
import {debugPlugin, enableLoadFromCache} from "../../config/global";

import {isRegexMatch} from "../../utils/regex";
import {CELL_REGEX} from "../../utils/patterns";
import {isPathTypescript} from "../../utils/path";
import {loadFileUrl} from "./loadFile";

// TBD: This should be broken and a separate loader for cells should be created
export const pluginLoadFromServer = () => {
  return {
    name: 'fetch-from-server-plugin',
    setup(build: esbuild.PluginBuild) {          
      // onLoad are for loading the file.

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        if (debugPlugin || true) {
          console.log('onLoad', args);
        }

        return await loadFileUrl(args.path, enableLoadFromCache);
      });
    }
  }
}