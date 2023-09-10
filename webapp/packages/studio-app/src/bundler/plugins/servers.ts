import {pkgServerUrl, serverUrl} from "../../config/global";



export const getPkgServer = (): string => {
    return `${pkgServerUrl}`;
}

export const getFileServer = (): string => {
    return `${serverUrl}`;
}
