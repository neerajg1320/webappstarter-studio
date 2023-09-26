import * as esbuild from "esbuild-wasm";
import {debugPlugin, enableLoadFromCache} from "../../config/global";

import {isRegexMatch} from "../../utils/regex";
import {CELL_REGEX} from "../../utils/patterns";
import {isPathTypescript} from "../../utils/path";
import {loadFileUrl} from "./loadSourceFiles";

// TBD: This should be broken and a separate loader for cells should be created
export const pluginLoadFromString = (code: string) => {
  return {
    name: 'fetch-from-server-plugin',
    setup(build: esbuild.PluginBuild) {          
      // onLoad are for loading the file.

      build.onLoad({ filter: CELL_REGEX }, async (args: esbuild.OnLoadArgs) => {
        if (debugPlugin || true) {
          console.log('pluginLoadFromString:onLoad()', args);
        }

        return {
          loader: isPathTypescript(args.path) ? 'tsx' : 'jsx',
          contents: code
        };
      });
    }
  }
}