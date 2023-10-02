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
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // onResolve are for path resolutions

      // Handle only the entry point
      build.onResolve({filter: /.*/}, (args: any) => {
        if (debugPlugin) {
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
      build.onResolve({filter: /^\.{1,2}\//}, (args: any) => {
        // let server = getServerFromArgs(args, true);
        let server = (new URL(args.importer)).origin;

        return {
          path: new URL(args.path, server + args.resolveDir + '/').href,
          namespace: 'a',
        };
      });

      // For any other files
      // These are non-relative files like 'react', 'react-dom', 'axios' etc
      // These are essentially library files.
      // TBD: We can pass the package server into the plugin
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        let name = args.path;
        // If package name is not of the form @monaco-editor/react
        // TBD: We need to add a dynamic way of detecting the package name
        // We have to compare the request.url and the response.url.
        // Then we have to compare the paths i.e. the url part after the origin.
        // The common part from start till @<version> in response.url is the package name
        // Also while resolving we should send the importPath. The packageConfig should then do a longest match
        if (args.path[0] !== "@") {
          // Need to parse import path. We need to check if explicit version is provided
          const namePart = args.path.split('/')[0];
          name = namePart.split('@')[0];
        }

        const pluginData = {name, importPath: args.path, importerURL: args.importer};

        let pkgUrlPath:string;
        if (onPackageDetect) {
          const detectResult = onPackageDetect(pluginData as PackageInfo);
          pkgUrlPath = detectResult.url;
        }

        return {
          path: pkgUrlPath,
          namespace: 'a',
          pluginData
        };
      });
    },
  };
};