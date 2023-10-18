import {transform} from "@svgr/core";

export const pluginSvgr = (resultFetcher: (path:string) => Promise<esbuild.OnLoadResult|null>, options = {}) => {
  return {
    name: 'svgr',
    setup(build) {
      build.onResolve({ filter: /\.svg$/ }, async (args) => {
        console.log(`pluginSvgr:onResolve args`, args);

        switch (args.kind) {
          case 'import-statement':
          case 'require-call':
          case 'dynamic-import':
          case 'require-resolve':
            return
          default:
            return {
              external: true,
            }
        }
      })

      build.onLoad({ filter: /\.svg$/ }, async (args) => {
        console.log(`pluginSvgr:onLoad args`, args);

        // const svg = await readFile(args.path, { encoding: 'utf8' })
        const svg = await resultFetcher(args.path);
        console.log(`svg:`, svg);

        // if (options.plugins && !options.plugins.includes('@svgr/plugin-jsx')) {
        //   options.plugins.push('@svgr/plugin-jsx')
        // } else if (!options.plugins) {
        //   options.plugins = ['@svgr/plugin-jsx']
        // }
        //
        // const contents = await transform(svg, { ...options }, { filePath: args.path })
        //
        // if (args.suffix === '?url') {
        //   return {
        //     contents: args.path,
        //     loader: 'text',
        //   }
        // }
        //
        // return {
        //   contents,
        //   loader: options.typescript ? 'tsx' : 'jsx',
        // }
      })
    },
  }
}