import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkgPathPlugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import {BundleInputType} from "../state/bundle";
import {combineCellsCode} from "../config/global";

let service: esbuild.Service;

export const bundleCodeStr = async(rawCode: string) => {
    return bundleCode(rawCode, 'cell');
}

export const bundleFilePath =  async(filePath: string) => {
    return bundleCode(filePath, 'project');
}

// The bundleCodeStr takes a string as input.
// In fetchPlugin, the onLoad method checks for index.js and provides this String
const bundleCode = async (codeOrFilePath: string, inputType: BundleInputType) => {
    // console.log(`bundleCode: '${inputType}': codeOrFilePath:'''${codeOrFilePath}'''`);

    if (!service) {
        service = await esbuild.startService({
            worker: true,
            // wasmURL: '/esbuild.wasm' // picks esbuild.wasm placed in public folder
            wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
        });
    }

    try {
        const builderServiceOptions: esbuild.BuildOptions = {
            // The following will be replaced by fetchPlugin to code for a cell
            // For filePath the fetchPlugin will download file from fileServer
            entryPoints: inputType === 'cell' ? ['__cell.js'] : [codeOrFilePath],
            bundle: true,
            write: false,
            // TBVE: Check if we can create an in-memory file and pass path to it
            plugins: [
                unpkgPathPlugin(inputType),
                fetchPlugin(codeOrFilePath, inputType)
            ],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window'
            },
        };

        if (inputType === 'cell' && combineCellsCode) {
            builderServiceOptions.jsxFactory = '_React.createElement';
            builderServiceOptions.jsxFragment = '_React.Fragment';
        }

        const result = await service.build(builderServiceOptions);

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
