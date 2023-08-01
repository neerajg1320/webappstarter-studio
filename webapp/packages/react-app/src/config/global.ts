export const debug = false;

// Cache
// We need to figure a strategy for invalidating Cache entry before we enable it.
export const cacheEnabled = false;
export const debugCache = false;

// Redux
export const reduxManualTest = false;
export const debugRedux = false;

// ESBuild Plugins
export const debugPlugin = false;

// Bundler
export const debugBundler = false;
export const autoBundling = false;
export const combineCellsCode = false;
export const cellFileNamePattern = /__cell.jsx?/;
export const cellFileName = '__cell.jsx';

// API Server
export const serverApiBaseUrl = 'http://localhost:8080/api/v1';
export const serverMediaBaseUrl = 'http://localhost:8080/mediafiles';
export const serverConnect = true;
export const syncCellsToServer = serverConnect && false;
export const syncProjectsToServer = serverConnect && true;
export const syncFilesToServer = serverConnect && true;

// Axios
export const debugAxios = false;

// React Components
export const debugComponent = false;
export const debugProject = false;

// Auth Component
export const debugAuth = true;
export const autoReauthenticateUser = true;
