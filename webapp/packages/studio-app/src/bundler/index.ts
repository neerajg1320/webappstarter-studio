import * as esbuild from 'esbuild-wasm';
import {pluginResolve} from './plugins/plugin-resolve';
import {pluginLoadFromServer} from './plugins/plugin-load-from-server';
import {BundleInputType, BundleLanguage, BundleResult} from "../state/bundle";
import {
  cellJsxFileName,
  cellTsxFileName,
  combineCellsCode,
  debugBundler, enableLoadCells, enableLoadFromIndexDBCache, enableLoadFromRedux, enableLoadFromServer, enableProfilerPlugin,
  esbuildVersion,
  pkgServerUrl
} from "../config/global";

import {pluginLoadFromCache} from "./plugins/indexDBCache";
import {pluginLoadFromRedux} from "./plugins/plugin-load-from-redux";
import {pluginProfiler} from "./plugins/plugin-profiler";
import {pluginCells} from "./plugins/plugin-cells";
import {getPkgServer} from "../api/servers";
import {PackageEntry, PackageInfo, PackageMap} from "./plugins/package";


export const initializeEsbuildBundler = async (): Promise<void> => {
  await esbuild.initialize({
    worker: true,
    // wasmURL: '/esbuild.wasm' // picks esbuild.wasm placed in public folder
    wasmURL: `${pkgServerUrl}/esbuild-wasm@${esbuildVersion}/esbuild.wasm`
  });

  // We can add delay for testing. This is very effective way to check flows in UI components
  // await delayTimer(3000);

  if (debugBundler) {
    console.log(`Esbuild Service: esbuild-wasm@${esbuildVersion}/esbuild.wasm downloaded successfully.`);
  }
}

// We have to fix the logic here.
// In case the esbuild.wasm file is not downloaded or there is an error. We need to communicate to user

export const bundleCodeStr = async (
    title: string,
    rawCode: string,
    bundleLanguage: BundleLanguage
) => {
  return bundleCode(title, rawCode, 'cell', bundleLanguage, null);
}

export const bundleFilePath =  async (
    title: string,
    filePath: string,
    bundleLanguage: BundleLanguage,
    fileFetcher: (path:string) => Promise<esbuild.OnLoadResult|null>
):Promise<BundleResult> => {
  return bundleCode(title, filePath, 'project', bundleLanguage, fileFetcher);
}

// The bundleCodeStr takes a string as input.
// In pluginLoadFromServer, the onLoad method checks for index.js and provides this String
const bundleCode = async (
    title: string,
    codeOrFilePath: string,
    inputType: BundleInputType,
    inputLanguage: BundleLanguage,
    fileFetcher: ((path:string) => Promise<esbuild.OnLoadResult|null>)|null
):Promise<BundleResult> => {
    if (debugBundler) {
      console.log(`bundleCode[${title}]: '${inputType}' '${codeOrFilePath}'`);
    }

    // This was a bad idea as the packageMap get copied and is not treated as a global structure
    // So we will use a callback function and see
    const packageMap = {} as PackageMap;

    const onPackageDetect:(PackageInfo) => void = (pkgInfo:PackageInfo) => {
      console.log(`onPackageDetect(): pkgInfo:`, pkgInfo);
    }

    // This will be called only when packages are not found in cache and are loaded from server
    // The packageMap once created should be stored. This would be analogous to package-lock.json
    const onPackageLoad:(PackageInfo) => void = (pkgInfo:PackageInfo) => {
      // console.log(`onPackageLoad(): pkgInfo:`, pkgInfo);

      if (!packageMap[pkgInfo.name]) {
        const {name, url, responseURL, version} = pkgInfo;
        packageMap[pkgInfo.name] = {name, url, responseURL, version, importers: []} as PackageEntry;
      }
      packageMap[pkgInfo.name].importers.push({
        url: pkgInfo.importerURL,
        importPath: pkgInfo.importPath
      });
    }

    const esbuildPlugins = [];

    if (enableProfilerPlugin) {
      esbuildPlugins.push(pluginProfiler(title));
    }

    esbuildPlugins.push(pluginResolve({pkgServer:getPkgServer(), onPackageDetect}));

    if (enableLoadFromRedux) {
      // fileFetcher would be null in case of call from bundleCodeStr
      if (fileFetcher) {
        esbuildPlugins.push(pluginLoadFromRedux(fileFetcher));
      }
    }

    if (enableLoadFromServer) {
      esbuildPlugins.push(pluginLoadFromServer({onPackageLoad}));
    }

    if (enableLoadCells) {
      esbuildPlugins.push(pluginCells(codeOrFilePath));
    }

    try {
        const builderServiceOptions: esbuild.BuildOptions = {
            // The following will be replaced by pluginLoadFromServer to code for a cell
            // For filePath the pluginLoadFromServer will download file from fileServer
            entryPoints: inputType === 'cell' ?
                [inputLanguage === BundleLanguage.TYPESCRIPT ? cellTsxFileName : cellJsxFileName] :
                [codeOrFilePath],
            bundle: true,

            // This prevents the write to disk
            write: false,
            // TBVE: Check if we can create an in-memory file and pass path to it
            plugins: esbuildPlugins,
            define: {
                // Do not change this. We have done this to prevent vite from replacing this to mode
                [import.meta.env.VITE_MODE_ENVIRONMENT_VAR]: '"production"',
                global: 'window'
            },
        };

        if (inputType === 'cell' && combineCellsCode) {
            builderServiceOptions.jsxFactory = '_React.createElement';
            builderServiceOptions.jsxFragment = '_React.Fragment';
        }

        // The esbuild.initialize should have been already invoked
        const result = await esbuild.build(builderServiceOptions);

        // TBD: Later we will add the functionality to specify explicit versions
        if (debugBundler || true) {
          console.log(`packageMap:`, packageMap);
        }

        return {
            code: result.outputFiles![0].text,
            err: '',
            packageMap
        } as BundleResult;
    } catch (err) {
        console.error(`Got bundler error:`, err);

        if (err instanceof Error) {
            console.error(`Got bundler error message:`, err.message);
            return {
                code: '',
                err: err.message
            } as BundleResult;
        } else {
            throw err;
        }
    }
}
