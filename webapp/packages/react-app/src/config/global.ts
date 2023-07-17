export const debug = false;

// Cache
// We need to figure a strategy for invalidating Cache entry before we enable it.
export const cacheEnabled = true;
export const debugCache = false;

// Redux
export const reduxManualTest = false;
export const debugRedux = true;

// ESBuild Plugins
export const debugPlugin = false;

// Bundler
export const autoBundling = false;
export const combineCellsCode = false;

// API Server
export const serverConnect = true;
export const syncCellsToServer = serverConnect && false;
export const syncProjectsToServer = serverConnect && true;
export const syncFilesToServer = serverConnect && true;
