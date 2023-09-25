import * as esbuild from "esbuild-wasm";
import {debugPlugin, enableLoadFromCache} from "../../config/global";

import {BundleInputType} from "../../state/bundle";
import {isRegexMatch} from "../../utils/regex";
import {CELL_REGEX} from "../../utils/patterns";
import {isPathTypescript} from "../../utils/path";
import {loadFileUrl} from "./loadSourceFiles";

export const pluginLoadFromServer = (inputCodeOrFilePath: string, inputType: BundleInputType) => {
  return {
    name: 'fetch-from-server-plugin',
    setup(build: esbuild.PluginBuild) {          
      // onLoad are for loading the file.

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        if (debugPlugin || true) {
          console.log('onLoad', args);
        }

        let result:esbuild.OnLoadResult = {};

        if (isRegexMatch(CELL_REGEX, args.path)) {
          result.loader = isPathTypescript(args.path) ? 'tsx' : 'jsx';
          result.contents  =  inputCodeOrFilePath;
        } else {
          result = await loadFileUrl(args.path, enableLoadFromCache);
        }

        return result;
      });
    }
  }
}