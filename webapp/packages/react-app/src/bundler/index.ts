import * as esbuild from 'esbuild-wasm';
import {pluginResolve} from './plugins/plugin-resolve';
import {pluginLoadFromServer} from './plugins/plugin-load-from-server';
import {BundleInputType, BundleLanguage} from "../state/bundle";
import {
  cellJsxFileName,
  cellTsxFileName,
  combineCellsCode,
  debugBundler, enableLoadFromCache, enableLoadFromRedux, enableLoadFromServer,
  esbuildVersion,
  pkgServerUrl
} from "../config/global";
import {getFileBasenameParts, getFileTypeFromPath} from "../utils/path";
import {pluginLoadFromCache} from "./plugins/plugin-load-from-cache";
import {pluginLoadFromRedux} from "./plugins/plugin-load-from-redux";

let service: esbuild.Service;

export const getESBuildService = async (): Promise<esbuild.Service> => {
  if (!service) {
    try {
      service = await esbuild.startService({
        worker: true,
        // wasmURL: '/esbuild.wasm' // picks esbuild.wasm placed in public folder
        wasmURL: `${pkgServerUrl}/esbuild-wasm@${esbuildVersion}/esbuild.wasm`
      });

      if (debugBundler) {
        console.log(`Esbuild Service: esbuild-wasm@${esbuildVersion}/esbuild.wasm downloaded successfully.`);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(`Error! Esbuild Service not Initiazed.`, err);
      }
    }
  }

  return service;
}

// We have to fix the logic here.
// In case the esbuild.wasm file is not downloaded or there is an error. We need to communicate to user

export const bundleCodeStr = async (
    rawCode: string,
    bundleLanguage: BundleLanguage
) => {
  return bundleCode(rawCode, 'cell', bundleLanguage, null);
}

export const bundleFilePath =  async (
    filePath: string,
    bundleLanguage: BundleLanguage,
    fileFetcher: (path:string) => Promise<esbuild.OnLoadResult|null>
) => {
  return bundleCode(filePath, 'project', bundleLanguage, fileFetcher);
}

// The bundleCodeStr takes a string as input.
// In pluginLoadFromServer, the onLoad method checks for index.js and provides this String
const bundleCode = async (
    codeOrFilePath: string,
    inputType: BundleInputType,
    inputLanguage: BundleLanguage,
    fileFetcher: ((path:string) => Promise<esbuild.OnLoadResult|null>)|null
) => {
    if (debugBundler) {
      console.log(`bundleCode: '${inputType}': codeOrFilePath:'''${codeOrFilePath}'''`);
    }

    const esbuildService = await getESBuildService();
    const esbuildPlugins = [
        pluginResolve()
    ];

    if (enableLoadFromRedux) {
      // fileFetcher would be null in case of call from bundleCodeStr
      if (fileFetcher) {
        esbuildPlugins.push(pluginLoadFromRedux(fileFetcher));
      }
    }
    if (enableLoadFromCache) {
      esbuildPlugins.push(pluginLoadFromCache());
    }
    if (enableLoadFromServer) {
      esbuildPlugins.push(pluginLoadFromServer(codeOrFilePath, inputType));
    }

    try {
        const builderServiceOptions: esbuild.BuildOptions = {
            // The following will be replaced by pluginLoadFromServer to code for a cell
            // For filePath the pluginLoadFromServer will download file from fileServer
            entryPoints: inputType === 'cell' ?
                [inputLanguage === BundleLanguage.TYPESCRIPT ? cellTsxFileName : cellJsxFileName] :
                [codeOrFilePath],
            bundle: true,
            write: false,
            // TBVE: Check if we can create an in-memory file and pass path to it
            plugins: esbuildPlugins,
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window'
            },
        };

        if (inputType === 'cell' && combineCellsCode) {
            builderServiceOptions.jsxFactory = '_React.createElement';
            builderServiceOptions.jsxFragment = '_React.Fragment';
        }

        const result = await esbuildService.build(builderServiceOptions);

        return {
            code: result.outputFiles![0].text,
            err: ''
        };
    } catch (err) {
        if (err instanceof Error) {
            return {
                code: '',
                err: err.message
            };
        } else {
            throw err;
        }
    }
}
