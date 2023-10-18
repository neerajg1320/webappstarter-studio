import * as esbuild from "esbuild-wasm";
import {debugPlugin, enableLoadFromIndexDBCache} from "../../config/global";

import {getLoadResult, loadPackgeFileUrl} from "./loadFile";
import {PackageInfo, PackageMap} from "./package";
import {getRegexMatches} from "../../utils/regex";
import {getLoadResultFromIndexDBCache, setLoadResultInIndexDBCache} from "./indexDBCache";
import {getFileType} from "../../utils/path";



const parseResonseURL = (responseURL:string, pkgName: string) => {
  const pkgUrlRegex = new RegExp(`^(.*)/(${pkgName}@[\\d.]+)/(.*)$`);
  // console.log(`[${pkgInfo.name}]`, responseURL, pkgUrlRegex);

  // We split the responseURL into three parts as shown in the below example
  // https://unpkg.com/scheduler@0.23.0/index.js is divided into
  // ["https://unpkg.com", "scheduler@0.23.0", "index.js"]
  // The output from getRegexMatches is as shown below. Notice the first element is complete match string:
  // ["https://unpkg.com/scheduler@0.23.0/index.js", "https://unpkg.com", "scheduler@0.23.0", "index.js"]
  const matches = getRegexMatches(pkgUrlRegex, responseURL)
  if (matches && matches.length > 0) {
    const [match, pkgServer, pkgNameVersion, pkgSuffix] = getRegexMatches(pkgUrlRegex, responseURL);

    // Since we have matched above with regex /(${pkgInfo.name}@[\\d.]+)/ we can be sure that pkgNameVersion is of the form
    // <pkgName>@<pkgVersion>
    const pkgVersion = pkgNameVersion.split('@')[1];

    // console.log(`[${pkgInfo.name}]`.padEnd(20), match.padEnd(50), pkgServer.padEnd(20), pkgNameVersion.padEnd(20), pkgVersion, pkgSuffix);

    return {version: pkgVersion};
  } else {
    console.log(`regex:${pkgUrlRegex} not matched url:${responseURL}`);
  }

  return null;
}

export interface PlugingLoadFromServerArgs {
  onPackageLoad?: (PackageInfo) => void;
}


export const pluginLoadFromServer = ({onPackageLoad}: PlugingLoadFromServerArgs) => {
  return {
    name: 'plugin-load-from-server',
    setup(build: esbuild.PluginBuild) {          
      // onLoad are for loading the file.

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        if (debugPlugin || false) {
          console.log('pluginLoadFromServer:onLoad args:', args);
        }

        let result: esbuild.OnLoadResult;

        if (enableLoadFromIndexDBCache) {
          result = await getLoadResultFromIndexDBCache(args.path);
          if (result) {
            if (debugPlugin) {
              console.log(`pluginLoadFromServer.onLoad: indexDBCache result:`, result);
            }

            return result;
          }
        }

        // args.path is a complete url created by onResolve
        const contentType = getFileType(args.path);
        const {content, responseURL} = await loadPackgeFileUrl(args.path)

        result = getLoadResult(content, contentType);
        // Keeping resolveDir is important
        result.resolveDir = new URL('./', responseURL).pathname;

        // We shall see if we can move this to cache-plugin
        if (enableLoadFromIndexDBCache) {
          await setLoadResultInIndexDBCache(args.path, result);
        }

        // console.log(`${args.path}:result:`, result)

        if (args.path !== responseURL) {
          if (args.pluginData) {
            const {name, importerURL, importPath} = args.pluginData;

            if (!name) {
              // args.path: 'https://unpkg.com/scheduler'
              // responseURL: 'https://unpkg.com/scheduler@0.23.0/index.js'
              // console.log(`Need to detect name. importPath:${importPath} args.path:${args.path} responseURL:${responseURL}`);

              if (onPackageLoad) {
                onPackageLoad({importerURL, importPath, url: args.path, responseURL} as PackageInfo);
              }
            }
          } else {
            // console.log(`No plugin data for`, args);
          }
        }


        return result;
      });
    }
  }
}