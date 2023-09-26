import * as esbuild from 'esbuild-wasm';
import {debugPlugin} from '../../config/global';
import {BundleInputType} from "../../state/bundle";
import {getPkgServer} from "./servers";
import {CELL_REGEX} from "../../utils/patterns";


// The plugins are created for each bundle request
// Hence we can use the closures for deciding the server to be contacted
export const pluginResolve = () => {
  const getNameSpace = (importer:string):string => {
    // return `a:${importer}`;
    return `a`;
  }
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // onResolve are for path resolutions

      // Kept for generating debug messages. It returns undefined so that lookup continues
      build.onResolve({filter: /.*/}, (args: any) => {
        if (debugPlugin) {
          console.log('onResolve', args);
        }
        return undefined;
      });

      // detection of hard coded file name for cell.
      build.onResolve({filter: CELL_REGEX}, (args: any) => {
        return {
          path: args.path,
          namespace: getNameSpace(args.importer),
        };
      });

      // For relative paths like ./abc, ../abc/def etc
      build.onResolve({filter: /^\.{1,2}\//}, (args: any) => {
        // let server = getServerFromArgs(args, true);
        let server = (new URL(args.importer)).origin;

        return {
          path: new URL(args.path, server + args.resolveDir + '/').href,
          namespace: getNameSpace(args.importer),
        };
      });

      // For any other file
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        // This is for entrypoint. There is no importer at the entry point.
        if (args.importer === '') {
          return {
            path: args.path,
            namespace: getNameSpace(args.importer),
          };
        }

        return {
          path: `${getPkgServer()}/${args.path}`,
          namespace: getNameSpace(args.importer),
        };
      });
    },
  };
};