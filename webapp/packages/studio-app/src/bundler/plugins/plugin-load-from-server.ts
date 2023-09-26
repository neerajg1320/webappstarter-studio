import * as esbuild from "esbuild-wasm";
import {debugPlugin, enableLoadFromCache} from "../../config/global";

import {loadFileUrl} from "./loadFile";
import {PackageMap} from "./package";


const parseResonseURL = (responseURL, requestURL) => {
    console.log(responseURL, requestURL);
    return {name: "react", version: "0.0.1", entry: "./index.js"};
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
        try {
          const {name, version, entry} = parseResonseURL(responseURL, args.path);
          pkgMap[name] = {...pkgMap[name], version, entry, url:responseURL};

        } catch (err) {
          console.log(err);
        }

        return result;
      });
    }
  }
}