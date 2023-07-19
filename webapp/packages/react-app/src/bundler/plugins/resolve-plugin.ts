import * as esbuild from 'esbuild-wasm';
import {cellFileNamePattern, debugPlugin} from '../../config/global';
import {BundleInputType} from "../../state/bundle";
import {getFileServer, getFileServerWithPath, getPkgServer} from "./remote";

// The plugins are created for each bundle request
// Hence we can use the closures for deciding the server to be contacted
export const resolvePlugin = (inputType: BundleInputType) => {
  // console.log(`resolvePlugin: closure created for inputType '${inputType}'`);
  const pkgServer = getPkgServer();
  const projectServer = getFileServer();
  const fileServerPath = getFileServerWithPath();


  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // onResolve are for path resolutions

      // TBD: Check if we can put an if condition between following two

      // detection of hard coded file name for cell.
      build.onResolve({filter: cellFileNamePattern}, (args: any) => {
        if (debugPlugin) {
            console.log('onResolve', args);
        }
        return { path: args.path, namespace: 'a'}
      });

      // For <project>/index.js: comes from a project
      // We prepend the projectServer to the path
      build.onResolve({filter: /^[\w-/]*\/index\.jsx?$/}, (args: any) => {
        if (debugPlugin) {
          console.log('onResolve', args);
        }
        return { path: `${fileServerPath}/${args.path}`, namespace: 'a'}
      });

      // For relative paths like ./xxx or ../xxx
      // We prepend the pkgServer to the path.
      // TBD: We have to fix this behaviour
      build.onResolve({filter: /^\.{1,2}\//}, (args: any) => {
        if (debugPlugin) {
            console.log('onResolve', args);
        }

        let server;
        if (args.importer.includes(pkgServer)) {
          server =  pkgServer;
        } else if (args.importer.includes(projectServer)) {
          server =  projectServer;
        } else {
          console.error(`Error! unexpected importer '${args.importer}'`);
          return;
        }

        return {
          path: new URL(args.path, server + args.resolveDir + '/').href,
          namespace: 'a'
        };
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