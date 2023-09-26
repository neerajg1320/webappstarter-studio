import * as esbuild from 'esbuild-wasm';
import {debugPlugin} from '../../config/global';
import {PackageMap, PackageInfo} from "./package";

// The plugins are created for each bundle request
// Hence we can use the closures for deciding the server to be contacted
export const pluginResolve = (pkgServer:string, pkgMap: PackageMap) => {
  const getNameSpace = (importer:string):string => {
    // return `a:${importer}`;
    return `a`;
  }
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // onResolve are for path resolutions

      // Handle only the entry point
      build.onResolve({filter: /.*/}, (args: any) => {
        if (debugPlugin || false) {
          console.log('onResolve', args);
        }

        // In case of entry point we have full URL with server
        if (args.kind === 'entry-point') {
          return {
            path: args.path,
            namespace: getNameSpace(args.importer),
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
          namespace: getNameSpace(args.importer),
        };
      });

      // For any other files
      // These are non-relative files like 'react', 'react-dom', 'axios' etc
      // These are essentially library files.
      // TBD: We can pass the package server into the plugin
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        pkgMap[args.path] = {name:args.path} as PackageInfo;

        return {
          path: `${pkgServer}/${args.path}`,
          namespace: getNameSpace(args.importer)
        };
      });
    },
  };
};