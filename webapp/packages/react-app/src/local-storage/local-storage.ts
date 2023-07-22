import {AuthInfo} from "../state/auth";

enum Storage {
  AUTH_INFO = 'auth_info',
}

export const fetchAuthFromLocalStorage = ():AuthInfo|null => {
  const authStr = localStorage.getItem(Storage.AUTH_INFO);
  if (authStr) {
    return JSON.parse(authStr) as AuthInfo;
  }
  return null;
}

export const saveAuthToLocalStorage = (auth: AuthInfo) => {
  localStorage.setItem(Storage.AUTH_INFO, JSON.stringify(auth));
}

export const removeAuthFromLocalStorage = () => {
  localStorage.removeItem(Storage.AUTH_INFO);
}
