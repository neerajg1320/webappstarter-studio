import * as esbuild from "esbuild-wasm";
import {debugPlugin, enableLoadFromIndexDBCache} from "../../config/global";

import {isRegexMatch} from "../../utils/regex";
import {CELL_REGEX} from "../../utils/patterns";
import {isPathTypescript} from "../../utils/path";
import {loadFileUrl} from "./loadFile";

// TBD: This should be broken and a separate loader for cells should be created
export const pluginCells = (code: string) => {
  return {
    name: 'cells-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({filter: CELL_REGEX}, (args: any) => {
        return {
          path: args.path,
          namespace: 'cells',
        };
      });

      build.onLoad({ filter: CELL_REGEX }, async (args: esbuild.OnLoadArgs) => {
        if (debugPlugin || true) {
          console.log('pluginCells:onLoad()', args);
        }

        return {
          loader: isPathTypescript(args.path) ? 'tsx' : 'jsx',
          contents: code
        };
      });
    }
  }
}