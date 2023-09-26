import * as esbuild from "esbuild-wasm";
import {debugPlugin, enableLoadFromCache} from "../../config/global";

import {loadFileUrl} from "./loadFile";
import {PackageInfo, PackageMap} from "./package";


const parseResonseURL = (responseURL:string, pkgInfo: PackageInfo) => {
    console.log(`[${pkgInfo.name}]`, responseURL);
    return {version: "0.0.1", entry: "./index.js"};
}

// TBD: This should be broken and a separate loader for cells should be created
export const pluginLoadFromServer = (pkgMap: PackageMap) => {
  return {
    name: 'fetch-from-server-plugin',
    setup(build: esbuild.PluginBuild) {          
      // onLoad are for loading the file.

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        if (debugPlugin || false) {
          console.log('onLoad', args);
        }
        const {result, responseURL} = await loadFileUrl(args.path, enableLoadFromCache)

        if (args.path !== responseURL) {
          try {
            const {version, entry} = parseResonseURL(responseURL, pkgMap[args.path]);
            pkgMap[args.path] = {...pkgMap[args.path], version, entry, url: responseURL};

          } catch (err) {
            console.log(err);
          }
        }

        return result;
      });
    }
  }
}