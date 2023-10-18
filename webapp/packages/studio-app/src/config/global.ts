export const debug = false;

// Cache
// We need to figure a strategy for invalidating Cache entry before we enable it.
export const debugCache = false;

// Redux
export const reduxManualTest = false;
export const debugRedux = false;
;


// ESBuild Plugins
export const debugPlugin = false;

// Bundler
export const debugBundler = false;
// export const esbuildVersion = "0.8.27";
// export const esbuildVersion = "0.11.15";
export const esbuildVersion = "0.18.20";
export const autoBundling = false;
export const combineCellsCode = false;
export const cellJsxFileName = '__cell.jsx';
export const cellTsxFileName = '__cell.tsx';
export const pkgServerUrl = 'https://unpkg.com';
export const autoBundleDebounce = 500;

// Flag for enabling in-memory fetching. Redux act as an ad-hoc file system.
export const enableLoadFromRedux = true;
// The following are required for loading packages
export const enableLoadFromIndexDBCache = true;
export const enableLoadFromServer = true;
export const enableLoadCells = true;
export const enableProfilerPlugin = true;
export const enableSvgr = true;



// API Server
// export const serverUrl = `https://api.webappstarter.com`;
// TBD: VITE
// export const serverUrl = `${process.env.REACT_APP_WEBAPPSTATER_API}`;

// export const serverUrl = `https://api.webappstarter.com`;
export const serverUrl = `${import.meta.env.VITE_APP_WEBAPPSTATER_API}`;
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

// Iframe
export const debugIframeMessages = false;

// Auth Component
export const debugAuth = false;
export const autoReauthenticateUser = true;
export const authOnAppStart = true;
export const placeholderEmail = "user@abc.com";
export const enableLocalStorageAuth = true;
export const anonymousUserEmail = "anonymous@webappstarter.com";
export const storeAnonymousToLocal = false;

// Optimization Markers
export const debugOptimizationMarker = false;
export const debugLocalOnlyPendingSupport = false;

// Features Visibility
export const advancedFeatures = true;

// Files
export const enableDiffForFileUpdate = true;
export const autoSaveDebounce = 750;
export const debugFileTree = false;

// Console
export const enableConsole = false;