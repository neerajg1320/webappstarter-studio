import * as esbuild from "esbuild-wasm";
import axios from "axios";
import {debugPlugin, debugCache, cacheEnabled} from "../../config/global";
import localforage from "localforage";
import {BundleInputType} from "../../state/bundle";
import {isRegexMatch} from "../../utils/regex";

const refereceCode = false;
let fileCache: LocalForage;

if (cacheEnabled) {
  fileCache = localforage.createInstance({
      name: 'fileCache'
  });

  // Sample function to demonstrate usage of fileCache
  if (refereceCode) {
      (async () => {
          await fileCache.setItem('color', 'red');
          const color = await fileCache.getItem('color');
          console.log('color:', color);
      })();
  }
}

export const fetchPlugin = (inputCodeOrFilePath: string, inputType: BundleInputType) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {          
    // onLoad are for loading the file.

    // Cache Check: Get from Cache if available
    // This check if the file is in the cache. If present then returns the cached result.
    // If not then it returns nothing. This forces the esbuild to look at subsequent onLoad handlers.
    build.onLoad({filter: /.*/}, async (args: any) => {
      if (debugPlugin) {
          console.log('onLoad', args);
      }

      // If we have already fetched this file then return from cache
      // We use args.path as key in the cache
      if (cacheEnabled) {
          const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
          if (cachedResult) {
              if (debugCache) {
                  console.log(`loaded ${args.path} from cache`);
              }
              return cachedResult;
          }
      }
    });
    
    build.onLoad({filter: /.css$/}, async (args: any) => {
      if (debugPlugin) {
          console.log('onLoad', args);
      }

      // Fetch the package from repo
      const {data, request} = await axios.get(args.path);

      // start: The custom part for css
      const escapedCssStr = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'" )

      const contents = `
          const style = document.createElement('style');
          style.innerText = '${escapedCssStr}';
          document.head.appendChild(style);
          `;
      // end

      const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname
      }

      if (cacheEnabled) {
          // Store result in cache
          await fileCache.setItem(args.path, result);
          if (debugCache) {
              console.log(`stored ${args.path} to cache`);
          }
      }

      return result;
  });    

    // We intercept the request and download from fileServer using axios
    build.onLoad({ filter: /.*/ }, async (args: any) => {
      if (debugPlugin) {
        console.log('onLoad', args);
      }

      let result: esbuild.OnLoadResult;

      // if (args.path === '__cell.js') {
      if (isRegexMatch(/__cell.jsx?/, args.path)) {
          result  = {
              loader: 'jsx',
              contents: inputCodeOrFilePath,
          };

      } else {
          // Note we are parsing the request as well to get the path of the downloaded file which might be different from the args.path
          const { data, request } = await axios.get(args.path);

          if (debugPlugin) {
              console.log(`request.responseURL:${request.responseURL}`);
          }

          result = {
              loader: 'jsx',
              contents: data,
              resolveDir: new URL('./', request.responseURL).pathname
          };

          if (cacheEnabled) {
              // Store result in cache
              await fileCache.setItem(args.path, result);
              if (debugCache) {
                  console.log(`stored ${args.path} to cache`);
              }
          }
        }

        if (debugPlugin) {
          console.log(`onLoad: for '${args.path}' returned `, result);
        }

        return result;
      });
    }
  }
}