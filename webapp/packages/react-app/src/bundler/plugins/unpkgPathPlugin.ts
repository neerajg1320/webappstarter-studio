import * as esbuild from 'esbuild-wasm';
import { debugPlugin } from '../../config/global';
import {BundleInputType} from "../../state/bundle";
import {getFileServer, getPkgServer} from "./remote";


// The plugins are created for each bundle request
// Hence we can use the closures for deciding the server to be contacted
export const unpkgPathPlugin = (inputType: BundleInputType) => {
  console.log(`unpkgPathPlugin: closure created for inputType '${inputType}'`);
  const pkgServer = getPkgServer();
  const fileServer = getFileServer();


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
        return { path: `${fileServer}/${args.path}`, namespace: 'a'}
      });

      // For relative paths like ./xxx or ../xxx
      build.onResolve({filter: /^\.{1,2}\//}, (args: any) => {
        if (debugPlugin) {
            console.log('onResolve', args);
        }
        return {
            path: new URL(args.path, fileServer + args.resolveDir + '/').href,
            namespace: 'a'
        };
      });

      // For anything else
      // We prepend the fileServer to the path
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        if (debugPlugin) {
          console.log('onResolve', args);
        }
 
        return { path: `${pkgServer}/${args.path}`, namespace: 'a' };
      });
 

    },
  };
};