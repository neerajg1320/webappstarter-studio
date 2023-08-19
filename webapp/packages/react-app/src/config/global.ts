export const debug = false;

// Cache
// We need to figure a strategy for invalidating Cache entry before we enable it.
export const cacheEnabled = false;
export const debugCache = false;

// Redux
export const reduxManualTest = false;
export const debugRedux = true;

// ESBuild Plugins
export const debugPlugin = false;

// Bundler
export const debugBundler = false;
export const autoBundling = false;
export const combineCellsCode = false;
export const cellJsxFileName = '__cell.jsx';
export const cellTsxFileName = '__cell.tsx';
export const pkgServerUrl = 'https://unpkg.com';


// API Server
// export const serverUrl = `https://api.webappstarter.com`;
export const serverUrl = `${process.env.REACT_APP_WEBAPPSTATER_API}`;
export const serverApiBaseUrl = `${serverUrl}/api/v1`;
export const serverMediaBaseUrl = `${serverUrl}/mediafiles`;
export const serverStaticBaseUrl = `${serverUrl}/staticfiles`;
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
export const debugAuth = false;
export const autoReauthenticateUser = true;
export const authOnAppStart = true;
export const placeholderEmail = "user@abc.com";
export const enableLocalStorageAuth = true;
export const anonymousUserEmail = "anonymous@webappstarter.com";
export const storeAnonymousToLocal = false;

