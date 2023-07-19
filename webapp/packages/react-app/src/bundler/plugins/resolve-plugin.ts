import * as esbuild from 'esbuild-wasm';
import {cellFileNamePattern, debugPlugin} from '../../config/global';
import {BundleInputType} from "../../state/bundle";
import {getFileServer, getPkgServer} from "./remote";
import {isRegexMatch} from "../../utils/regex";

const getServerFromArgs = (args:any, isRelativePath:boolean):string|undefined =>  {
  console.log(`getServerFromArgs: `, args);

  const pkgServer = getPkgServer();
  const projectServer = getFileServer();

  let server;

  if (isRelativePath) {
    if (args.importer.includes(pkgServer)) {
      server = pkgServer;
    } else if (args.importer.includes(projectServer)) {
      server = projectServer;
    } else {
      console.error(`Error! unexpected importer '${args.importer}' in relative path '${args.path}'`);
    }
  // When path is not relative then we resolve to package server in all cases other than starting file
  } else {
    if (args.importer === '') {
      server = projectServer;
    } else {
      server = pkgServer;
    }
  }

  return server;
}

// The plugins are created for each bundle request
// Hence we can use the closures for deciding the server to be contacted
export const resolvePlugin = (inputType: BundleInputType) => {
  // console.log(`resolvePlugin: closure created for inputType '${inputType}'`);


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

      // For relative paths like ./xxx or ../xxx
      // We prepend the pkgServer to the path.
      // TBD: We have to fix this behaviour
      build.onResolve({filter: /^\.{1,2}\//}, (args: any) => {
        if (debugPlugin) {
            console.log('onResolve', args);
        }

        let server = getServerFromArgs(args, true);

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

        // let server = getServerFromArgs(args);
        let server = getServerFromArgs(args, false);

        return { path: `${server}/${args.path}`, namespace: 'a' };
      });
    },
  };
};