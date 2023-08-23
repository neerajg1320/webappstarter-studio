import * as esbuild from 'esbuild-wasm';
import {debugPlugin} from '../../config/global';
import {BundleInputType} from "../../state/bundle";
import {getFileServer, getPkgServer} from "./servers";
import {CELL_REGEX, JSTS_REGEX} from "../../utils/patterns";

const getServerFromArgs = (args:any, isRelativePath:boolean):string|undefined =>  {
  if (debugPlugin && false) {
    console.log(`getServerFromArgs: `, args);
  }

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
export const pluginResolve = (inputType: BundleInputType) => {
  // console.log(`pluginResolve: closure created for inputType '${inputType}'`);


  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // onResolve are for path resolutions

      // detection of hard coded file name for cell.
      build.onResolve({filter: CELL_REGEX}, (args: any) => {
        if (debugPlugin) {
            console.log('onResolve', args);
        }
        return {
          path: args.path,
          namespace: 'a'
        };
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

      // For any other Javascript/Typescript file
      // We prepend the pkgServer to the path
      // build.onResolve({ filter: JSTS_REGEX }, async (args: any) => {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        if (debugPlugin) {
          console.log('onResolve', args);
        }

        // let server = getServerFromArgs(args);
        let server = getServerFromArgs(args, false);

        return {
          path: `${server}/${args.path}`,
          namespace: 'a'
        };
      });
    },
  };
};