import * as esbuild from 'esbuild-wasm';
import {debugPlugin} from "../../config/global";
import {PackageMap} from "./package";

export const pluginProfiler = (title:string) => {
  let startTime;
  let endTime;

  return {
    name: 'profiler-plugin',
    setup:  (build: esbuild.PluginBuild) => {

      build.onResolve({filter: /.*/}, (args: esbuild.OnResolveArgs) => {
        // We don't need  namespace, kind, pluginData yet
        const {path, importer, resolveDir} = args;

        if (debugPlugin || false) {
          console.log(`pluginProfiler:onResolve() [${path.padEnd(40)}  ${importer.padEnd(80)} ${resolveDir}]`);
        }
        return undefined;
      });

      build.onLoad({filter: /.*/}, (args:  esbuild.OnLoadArgs) => {
        // console.log(`pluginProfiler:onLoad() args`, args);
        return undefined;
      });

      build.onStart(() => {
        startTime = new Date();
        // console.log(`Build Started`)
      });

      build.onEnd((result) => {
        endTime = new Date();

        // console.log(`pkgMap:`, pkgMap);
        // The result is the result that we get at the end of the build
        // console.log(`[${title}]: Build Finished (${endTime - startTime}ms), ${result.errors.length} errors`)
      });
    }
  }
}