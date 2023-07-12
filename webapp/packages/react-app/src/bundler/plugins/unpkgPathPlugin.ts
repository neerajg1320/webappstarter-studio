import * as esbuild from 'esbuild-wasm';
import { debugPlugin } from '../../config/global';
import {BundleInputType} from "../../state/bundle";
import {getFileServer, getFileServerWithPath, getPkgServer} from "./remote";
import path from "path";

// The plugins are created for each bundle request
// Hence we can use the closures for deciding the server to be contacted
export const unpkgPathPlugin = (inputType: BundleInputType) => {
  // console.log(`unpkgPathPlugin: closure created for inputType '${inputType}'`);
  const pkgServer = getPkgServer();
  const fileServer = getFileServer();
  const fileServerPath = getFileServerWithPath();


  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // onResolve are for path resolutions

      // TBD: Check if we can put an if condition between following two

      // For index.js, comes from a cell
      build.onResolve({filter: /^index\.js[x]?$/}, (args: any) => {
        if (debugPlugin) {
            console.log('onResolve', args);
        }
        return { path: args.path, namespace: 'a'}
      });

      // For <project>/index.js: comes from a project
      // We prepend the fileServer to the path
      build.onResolve({filter: /^\w+\/index\.js[x]?$/}, (args: any) => {
        if (debugPlugin) {
          console.log('onResolve', args);
        }
        return { path: `${fileServerPath}/${args.path}`, namespace: 'a'}
      });

      // For relative paths like ./xxx or ../xxx
      // We prepend the pkgServer to the path.
      // TBD: We have to fix this behaviour
      build.onResolve({filter: /^\.{1,2}\//}, (args: any) => {
        if (debugPlugin || true) {
            console.log('onResolve', args);
        }

        if (args.importer.includes(pkgServer)) {
          return {
            path: new URL(args.path, pkgServer + args.resolveDir + '/').href,
            namespace: 'a'
          };
        }
        if (args.importer.includes(fileServer)) {
          return {
            path: new URL(args.path, fileServer + args.resolveDir + '/').href,
            namespace: 'a'
          };
        }
        console.error(`Error! unexpected importer '${args.importer}'`);
      });

      // For anything else
      // We prepend the pkgServer to the path
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        if (debugPlugin) {
          console.log('onResolve', args);
        }
 
        return { path: `${pkgServer}/${args.path}`, namespace: 'a' };
      });
 

    },
  };
};