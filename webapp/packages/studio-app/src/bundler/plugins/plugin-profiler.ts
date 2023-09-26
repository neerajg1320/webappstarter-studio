import * as esbuild from 'esbuild';

export const pluginProfiler = () => {
  return {
    'name': 'profiler-plugin',
    setup(build: esbuild.PluginBuild) {

      build.onResolve({filter: /.*/}, (args) => {
        console.log(`args`, args);
      })
    }
  }
}