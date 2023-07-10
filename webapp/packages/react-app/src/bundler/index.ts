import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkgPathPlugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import {BundleInputType} from "../state/bundle";

let service: esbuild.Service;

export const bundleCodeStr = async(rawCode: string) => {
    return bundleCode(rawCode, 'cell');
}

export const bundleFilePath =  async(rawCode: string) => {
    return bundleCode(rawCode, 'project');
}

// The bundleCodeStr takes a string as input.
// In fetchPlugin, the onLoad method checks for index.js and provides this String
const bundleCode = async (codeOrfilePath: string, inputType: BundleInputType) => {
    if (!service) {
        service = await esbuild.startService({
            worker: true,
            // wasmURL: '/esbuild.wasm' // picks esbuild.wasm placed in public folder
            wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
        });
    }

    try {
        const result = await service.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            // TBVE: Check if we can create an in-memory file and pass path to it
            plugins: [
                unpkgPathPlugin(inputType),
                fetchPlugin(codeOrfilePath)
            ],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window'
            },
            jsxFactory: '_React.createElement',
            jsxFragment: '_React.Fragment'
        });
        return {
            code: result.outputFiles[0].text,
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
