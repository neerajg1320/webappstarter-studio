import {AuthInfo} from "../state/auth";
import {anonymousUserEmail, debugAuth, storeAnonymousToLocal} from "../config/global";

enum Storage {
  AUTH_INFO = 'auth_info',
}


export const fetchAuthFromLocalStorage: () => AuthInfo|null = () => {
  const authStr = localStorage.getItem(Storage.AUTH_INFO);

  if (authStr) {
    return JSON.parse(authStr) as AuthInfo
  }

  return null;
}

export const saveAuthToLocalStorage = (auth: AuthInfo) => {
  if (!storeAnonymousToLocal && auth.user.email === anonymousUserEmail) {
    return;
  }
  localStorage.setItem(Storage.AUTH_INFO, JSON.stringify(auth));
}

export const removeAuthFromLocalStorage = () => {
  localStorage.removeItem(Storage.AUTH_INFO);
}
