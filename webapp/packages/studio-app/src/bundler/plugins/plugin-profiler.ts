import * as esbuild from 'esbuild';

export const pluginProfiler = (title:string) => {
  let startTime;
  let endTime;

  return {
    name: 'profiler-plugin',
    setup:  (build: esbuild.PluginBuild) => {

      build.onResolve({filter: /.*/}, (args: esbuild.OnResolveArgs) => {
        // console.log(`pluginProfiler:onResolve() args`, args);
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

        // The result is the result that we get at the end of the build
        console.log(`[${title}]: Build Finished (${endTime - startTime}ms), ${result.errors.length} errors`)
      });
    }
  }
}