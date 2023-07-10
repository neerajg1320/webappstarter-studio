const pkgServer = 'https://unpkg.com';


export const getPkgServer = (): string => {
    return `${pkgServer}`;
}

export const getFileServer = (): string => {
    return `http://localhost:8080`;
}

export const getFileServerWithPath = (): string => {
    const userIDStr = 'user_1';
    return `http://localhost:8080/mediafiles/${userIDStr}`;
}