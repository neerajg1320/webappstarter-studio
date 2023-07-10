import {BundleInputType} from "../../state/bundle";

export const getServer = (inputType: BundleInputType): string => {
    // TBD: Currently the user id string is hardcoded
    const userIDStr = 'user_1';

    return (inputType === 'cell')
        ? 'https://unpkg.com'
        : `http://localhost:8080/mediafiles/${userIDStr}`;
}