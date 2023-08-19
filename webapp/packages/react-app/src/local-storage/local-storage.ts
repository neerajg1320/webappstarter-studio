import {anonymousUserEmail, debugAuth, storeAnonymousToLocal} from "../config/global";
import {ReduxUser} from "../state/user";

enum Storage {
  USER_KEY = 'user',
}


export const fetchAuthFromLocalStorage: () => ReduxUser|null = () => {
  const authStr = localStorage.getItem(Storage.USER_KEY);

  if (authStr) {
    return JSON.parse(authStr) as ReduxUser
  }

  return null;
}

export const saveAuthToLocalStorage = (user: ReduxUser) => {
  if (!storeAnonymousToLocal && user.email === anonymousUserEmail) {
    return;
  }
  localStorage.setItem(Storage.USER_KEY, JSON.stringify(user));
}

export const removeAuthFromLocalStorage = () => {
  localStorage.removeItem(Storage.USER_KEY);
}
