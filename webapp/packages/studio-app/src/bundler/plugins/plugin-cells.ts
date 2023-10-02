import * as esbuild from "esbuild-wasm";
import {debugPlugin} from "../../config/global";

import {CELL_REGEX} from "../../utils/patterns";
import {isPathTypescript} from "../../utils/path";

export const pluginCells = (code: string) => {
  return {
    name: 'plugin-cells',
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