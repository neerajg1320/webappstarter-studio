import * as esbuild from "esbuild-wasm";
import {axiosInstance} from "../../api/axiosApi";
import {debugPlugin} from "../../config/global";

import {BundleInputType} from "../../state/bundle";
import {isRegexMatch} from "../../utils/regex";
import {CELL_REGEX} from "../../utils/patterns";
import {isPathTypescript} from "../../utils/path";
import {setFileInCache} from "./plugin-load-from-cache";

export const pluginLoadFromServer = (inputCodeOrFilePath: string, inputType: BundleInputType) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {          
      // onLoad are for loading the file.

      // handle files ending in css.
      // This would handle scss files as well as . matches anything and process them as css files
      build.onLoad({filter: /.css$/}, async (args: any) => {
        if (debugPlugin) {
            console.log('onLoad', args);
        }

        // Fetch the package from repo
        const {data, request} = await axiosInstance.get(args.path);

        // start: The custom part for css
        const escapedCssStr = data
            .replace(/\n/g, '')
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'" )

        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escapedCssStr}';
            document.head.appendChild(style);
            `;
        // end

        const result: esbuild.OnLoadResult = {
            loader: 'jsx',
            contents,
            resolveDir: new URL('./', request.responseURL).pathname
        }

        await setFileInCache(args.path, result);

        return result;
      });

      // We intercept the request and download from fileServer using axios
      // build.onLoad({ filter: JSTS_REGEX }, async (args: any) => {
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (debugPlugin) {
          console.log('onLoad', args);
        }

        let result: esbuild.OnLoadResult = {
          loader: isPathTypescript(args.path) ? 'tsx' : 'jsx'
        };

        if (isRegexMatch(CELL_REGEX, args.path)) {
          result.contents  =  inputCodeOrFilePath;
        } else {
          // Note we are parsing the request as well to get the path of the downloaded file which might be
          // different from the args.path
          const { data, request } = await axiosInstance.get(args.path);

          if (debugPlugin) {
              console.log(`request.responseURL:${request.responseURL}`);
          }

          result.contents = data;
          result.resolveDir = new URL('./', request.responseURL).pathname;

          await setFileInCache(args.path, result);
        }

        if (debugPlugin && false) {
          console.log(`onLoad: for '${args.path}' returned `, result);
        }

        return result;
      });
    }
  }
}