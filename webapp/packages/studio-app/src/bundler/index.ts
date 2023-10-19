import * as esbuild from 'esbuild-wasm';
import {pluginResolve} from './plugins/plugin-resolve';
import {pluginLoadFromServer} from './plugins/plugin-load-from-server';
import {BundleInputType, BundleLanguage, BundleResult} from "../state/bundle";
import {
  cellJsxFileName,
  cellTsxFileName,
  combineCellsCode,
  debugBundler,
  enableLoadCells,
  enableLoadFromIndexDBCache,
  enableLoadFromRedux,
  enableLoadFromServer,
  enableProfilerPlugin,
  enableSvgr,
  esbuildVersion,
  pkgServerUrl
} from "../config/global";

import {pluginLoadFromRedux} from "./plugins/plugin-load-from-redux";
import {pluginProfiler} from "./plugins/plugin-profiler";
import {pluginCells} from "./plugins/plugin-cells";
import {getPkgServer} from "../api/servers";
import {PackageDetectResult, PackageEntry, PackageInfo, PackageMap} from "./plugins/package";
import {getRegexMatches} from "../utils/regex";

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
    resultFetcher: (path:string) => Promise<esbuild.OnLoadResult|null>,
    getPackageVersion?: (name:string) => PackageDetectResult,
    setPackageVersion?: (name:string, pkgDependency:string) => void,
    projectRootUrl?: string,
):Promise<BundleResult> => {
  return bundleCode(title, filePath, 'project', bundleLanguage, resultFetcher, getPackageVersion, setPackageVersion, projectRootUrl);
}

// The bundleCodeStr takes a string as input.
// In pluginLoadFromServer, the onLoad method checks for index.js and provides this String
const bundleCode = async (
    title: string,
    codeOrFilePath: string,
    inputType: BundleInputType,
    inputLanguage: BundleLanguage,
    resultFetcher: ((path:string) => Promise<esbuild.OnLoadResult|null>)|null,
    getPackageVersion?: (name:string) => PackageDetectResult,
    setPackageVersion?: (name:string, version:string) => void,
    projectRootUrl?: string,
):Promise<BundleResult> => {
    if (debugBundler) {
      console.log(`bundleCode[${title}]: '${inputType}' '${codeOrFilePath}'`);
    }

    // This was a bad idea as the packageMap get copied and is not treated as a global structure
    // So we will use a callback function and see
    const packageMap = {} as PackageMap;

    const onPackageDetect:(PackageInfo) => PackageDetectResult = (pkgInfo:PackageInfo) => {
      let detectResult;
      if (getPackageVersion) {
        detectResult = getPackageVersion(pkgInfo.importPath);
        // console.log(`onPackageDetect(): detectResult:`, detectResult);
      }

      return detectResult;
    }

    // This will be called only when packages are not found in cache and are loaded from server
    // The packageMap once created should be stored. This would be analogous to package-lock.json
    const onPackageLoad:(PackageInfo) => void = (pkgInfo:PackageInfo) => {
      // console.log(`onPackageLoad(): pkgInfo:`, pkgInfo);

      if (!pkgInfo.name) {
        const {url, responseURL} = pkgInfo;

        // console.log(`We need to derive name and version`, pkgInfo);

        // const suffixURL = responseURL.substring(url.length);
        // console.log(`suffixPath:`, suffixURL);

        const responseURLRegex = new RegExp(`(${getPkgServer()})\/(.*)@(\\d+(?:\\.\\d+)*)\\/(.*)`)
        const matches = getRegexMatches(responseURLRegex, responseURL);
        if (matches) {
          const [fullURL, origin, name, version, suffixPath] = matches;
          // console.log(`matches:`, fullURL, origin, name, version, suffixPath);

          if (!packageMap[name]) {
            packageMap[name] = {name, url, responseURL, version, importers: []} as PackageEntry;

            if (setPackageVersion) {
              setPackageVersion(name, version);
            }
          }
          
          packageMap[name].importers.push({
            url: pkgInfo.importerURL,
            importPath: pkgInfo.importPath
          });
        }
      }
    }

    const esbuildPlugins = [];

    if (enableProfilerPlugin) {
      esbuildPlugins.push(pluginProfiler(title));
    }

    if (enableSvgr) {
      // esbuildPlugins.push(pluginSvgr(resultFetcher));
    }

    esbuildPlugins.push(pluginResolve({
      pkgServer:getPkgServer(), projectServer: projectRootUrl, onPackageDetect
    }));

    if (enableLoadFromRedux) {
      // resultFetcher would be null in case of call from bundleCodeStr
      esbuildPlugins.push(pluginLoadFromRedux(resultFetcher));
    }

    if (enableLoadFromServer) {
      esbuildPlugins.push(pluginLoadFromServer({onPackageLoad}));
    }

    if (enableLoadCells) {
      esbuildPlugins.push(pluginCells(codeOrFilePath));
    }

    const jsxAuto = (inputType === 'cell' && combineCellsCode) || true;

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
            loader: { '.svg': 'dataurl' },
            define: {
                // Do not change this. We have done this to prevent vite from replacing this to mode
                [import.meta.env.VITE_MODE_ENVIRONMENT_VAR]: '"production"',
                global: 'window'
            },
        };

        if (jsxAuto) {
          builderServiceOptions.jsx = 'automatic';
          // The following has been kept for refernece. It was used earlier to support jsx automatic import.
          // builderServiceOptions.jsxFactory = '_React.createElement';
          // builderServiceOptions.jsxFragment = '_React.Fragment';
        }

        // The esbuild.initialize should have been already invoked
        const result = await esbuild.build(builderServiceOptions);

        // TBD: Later we will add the functionality to specify explicit versions
        if (debugBundler) {
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
