import {BundleInputType} from "../../state/bundle";

const pkgServer = 'https://unpkg.com';

export const getServer = (inputType: BundleInputType): string => {
    // TBD: Currently the user id string is hardcoded

    return (inputType === 'cell')
        ? getPkgServer()
        : getFileServer()
}

export const getPkgServer = (): string => {
    return `${pkgServer}`;
}

export const getFileServer = (): string => {
    const userIDStr = 'user_1';
    return `http://localhost:8080/mediafiles/${userIDStr}`;
}