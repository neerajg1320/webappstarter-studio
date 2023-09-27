import * as esbuild from "esbuild-wasm";
import {debugPlugin, enableLoadFromCache} from "../../config/global";

import {loadFileUrl} from "./loadFile";
import {PackageInfo, PackageMap} from "./package";
import {getRegexMatches} from "../../utils/regex";


const parseResonseURL = (responseURL:string, pkgName: string) => {
  const pkgUrlRegex = new RegExp(`^(.*)/(${pkgName}@[\\d.]+)/(.*)$`);
  // console.log(`[${pkgInfo.name}]`, responseURL, pkgUrlRegex);

  // We split the responseURL into three parts as shown in the below example
  // https://unpkg.com/scheduler@0.23.0/index.js is divided into
  // ["https://unpkg.com", "scheduler@0.23.0", "index.js"]
  // The output from getRegexMatches is as shown below. Notice the first element is complete match string:
  // ["https://unpkg.com/scheduler@0.23.0/index.js", "https://unpkg.com", "scheduler@0.23.0", "index.js"]

  const [match, pkgServer, pkgNameVersion, pkgSuffix] = getRegexMatches(pkgUrlRegex, responseURL);

  // Since we have matched above with regex /(${pkgInfo.name}@[\\d.]+)/ we can be sure that pkgNameVersion is of the form
  // <pkgName>@<pkgVersion>
  const pkgVersion = pkgNameVersion.split('@')[1];

  // console.log(`[${pkgInfo.name}]`.padEnd(20), match.padEnd(50), pkgServer.padEnd(20), pkgNameVersion.padEnd(20), pkgVersion, pkgSuffix);

  return {version: pkgVersion};
}

// TBD: This should be broken and a separate loader for cells should be created
export const pluginLoadFromServer = (onPackageLoad:(PackageInfo) => void) => {
  return {
    name: 'fetch-from-server-plugin',
    setup(build: esbuild.PluginBuild) {          
      // onLoad are for loading the file.

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        if (debugPlugin || false) {
          console.log('onLoad', args);
        }
        const {result, responseURL} = await loadFileUrl(args.path, enableLoadFromCache)
        // console.log(`args:`, args, `responseURL:${responseURL}`)
        if (args.path !== responseURL) {
          try {
            const {name, importerURL, importPath} = args.pluginData;
            const {version} = parseResonseURL(responseURL, name);
            // console.log(`[${args.path.padEnd(50)}]`, version);
            if (onPackageLoad) {
              onPackageLoad({name, importerURL, importPath, version, url: args.path, responseURL} as PackageInfo);
            }
          } catch (err) {
            console.error(err);
          }
        }

        return result;
      });
    }
  }
}