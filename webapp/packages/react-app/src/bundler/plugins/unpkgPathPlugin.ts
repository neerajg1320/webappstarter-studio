import * as esbuild from 'esbuild-wasm';
import { debugPlugin } from '../../config/global';
import {BundleInputType} from "../../state/bundle";


export const unpkgPathPlugin = (inputType: BundleInputType) => {
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
            path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href,
            namespace: 'a'
        };
      });

      // For anything else
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        if (debugPlugin) {
          console.log('onResolve', args);
        }
 
        return { path: `https://unpkg.com/${args.path}`, namespace: 'a' };
      });
 

    },
  };
};