import * as esbuild from 'esbuild-wasm';
import { debugPlugin } from '../../config/global';
import {BundleInputType} from "../../state/bundle";
import {getServer} from "./remote";


// The plugins are created for each bundle request
// Hence we can use the closures for deciding the server to be contacted
export const unpkgPathPlugin = (inputType: BundleInputType) => {
  console.log(`unpkgPathPlugin: closure created for ${inputType}`);
  const fileServer = getServer(inputType);

  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // onResolve are for path resolutions

      // For index.js
      build.onResolve({filter: /^index\.js[x]?$/}, (args: any) => {
        if (debugPlugin) {
            console.log('onResolve', args);
        }
        return { path: args.path, namespace: 'a'}
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
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        if (debugPlugin) {
          console.log('onResolve', args);
        }
 
        return { path: `${fileServer}/${args.path}`, namespace: 'a' };
      });
 

    },
  };
};