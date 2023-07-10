import {BundleInputType} from "../../state/bundle";

export const getServer = (inputType: BundleInputType): string => {
    return (inputType === 'cell') ? 'https://unpkg.com' : 'http://localhost:8080/mediafiles';
}