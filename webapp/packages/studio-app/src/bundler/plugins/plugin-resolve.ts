import * as esbuild from 'esbuild-wasm';
import {debugPlugin} from '../../config/global';
import {PackageDetectResult, PackageInfo} from "./package";

export interface PluginResolveArgs {
  pkgServer: string,
  onPackageDetect?: (PackageInfo) => PackageDetectResult,
}

// The plugins are created for each bundle request
// Hence we can use the closures for deciding the server to be contacted
export const pluginResolve = ({pkgServer, onPackageDetect}:PluginResolveArgs) => {

  return {
    name: 'plugin-resolve',
    setup(build: esbuild.PluginBuild) {
      // onResolve are for path resolutions

      // Handle only the entry point
      build.onResolve({filter: /.*/}, (args: any) => {
        if (debugPlugin || false) {
          console.log('onResolve', args);
        }

        // In case of entry point we have full URL with server
        if (args.kind === 'entry-point') {
          const pluginData = {name: 'entryPoint', importPath: args.path, importerURL: args.importer};
          // if (onPackageResolve) {
          //   onPackageResolve(pluginData as PackageInfo);
          // }

          return {
            path: args.path,
            namespace: 'a',
            pluginData
          };
        }

        return undefined;
      });

      // For relative paths like ./abc, ../abc/def etc we get the server from importer
      build.onResolve({filter: /^\.{0,2}\//}, (args: any) => {
        console.log(`pluginResolve:onResolve args:`, args);

        let lookupPath = args.path;
        // If it is an absolute path then we also include the /public folder
        if (args.path[0] == "/") {

        }

        const server = (new URL(args.importer)).origin;
        const url = new URL(lookupPath, server + args.resolveDir + '/').href

        return {
          path: url,
          namespace: 'a',
        };
      });

      // For any other files
      // These are non-relative files like 'react', 'react-dom', 'axios' etc
      // These are essentially library files.
      // TBD: We can pass the package server into the plugin
      build.onResolve({ filter: /.*/ }, async (args: any):Promise<esbuild.OnResolveResult> => {
        const pluginData = {importPath: args.path, importerURL: args.importer} as PackageInfo;

        let pkgUrlPath:string;
        if (onPackageDetect) {
          const detectResult = onPackageDetect(pluginData as PackageInfo);
          if (detectResult) {
            pkgUrlPath = detectResult.url;
            if (detectResult.name) {
              pluginData.name = detectResult.name;
            }

            return {path: pkgUrlPath, namespace: 'a', pluginData};
          } else {
            console.error(`No detectResult`);
          }
        }
      });
    },
  };
};