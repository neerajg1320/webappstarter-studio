import * as esbuild from "esbuild-wasm";
import {debugPlugin, enableLoadFromCache} from "../../config/global";

import {BundleInputType} from "../../state/bundle";
import {isRegexMatch} from "../../utils/regex";
import {CELL_REGEX} from "../../utils/patterns";
import {isPathTypescript} from "../../utils/path";
import {loadCssUrl, loadFileUrl} from "./loadSourceFiles";



export const pluginLoadFromServer = (inputCodeOrFilePath: string, inputType: BundleInputType) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {          
      // onLoad are for loading the file.

      // handle files ending in css.
      // This would handle scss files as well as . matches anything and process them as css files
      // build.onLoad({filter: /.css$/}, async (args: esbuild.OnLoadArgs) => {
      //   if (debugPlugin) {
      //       console.log('onLoad', args);
      //   }
      //
      //   return await loadFileUrl(args.path, enableLoadFromCache);
      // });

      // We intercept the request and download from fileServer using axios
      // build.onLoad({ filter: JSTS_REGEX }, async (args: any) => {
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        if (debugPlugin) {
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