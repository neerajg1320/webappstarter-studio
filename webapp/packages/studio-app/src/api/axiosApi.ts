import axios from 'axios';
import {autoReauthenticateUser, debugAxios, debugOptimizationMarker, serverApiBaseUrl} from "../config/global";
import {reAuthenticateUserNotSupported} from "../state/action-creators";

export const axiosInstance = axios.create({
  // baseURL: serverMediaBaseUrl
});

export const axiosApiInstance = axios.create({
  baseURL: serverApiBaseUrl
});


let gRequestInterceptor:number|null = null;
let gResponseInterceptor:number|null = null;
// TBD: We need to strengthen this logic.
// axios even though very popular, but its flaws are biting us now.

export const setAxiosAuthToken = (jwtToken: string) => {
  if (debugAxios) {
    console.log(`setAuthentication: jwtToken:`, jwtToken);
  }

  // This is causing problem, we have to unset it as well on logout
  gRequestInterceptor = axiosApiInstance.interceptors.request.use(config => {
      if (debugAxios) {
        console.log(`request intercepted:`, config);
      }

      // The following is a workaround
      // The axios library has a bug around applying headers in middleware.
      // The headers are applied to all instances.
      // In fact the other vars like baseUrl are also applied to all instances
      const skippedUrls = ['/mediafiles', '/api/v1/auth/login'].filter(item => config.url?.includes(item));
      if (skippedUrls.length > 0) {
        if (debugOptimizationMarker) {
          console.log(`Token skipped for url '${skippedUrls}' Need to put a better solution`);
        }
      } else {
        config.headers['Authorization'] = `Bearer ${jwtToken}`;
      }

      return config;
    },
    error => {
      if (debugAxios) {
        console.log(`request error:`, error);
      }
      return Promise.reject(error);
    }
  )

  gResponseInterceptor = axiosApiInstance.interceptors.response.use(response => {
        if (debugAxios) {
          console.log(`response intercepted:`, response);
        }

        return response;
      },
      error => {
        if (debugAxios) {
          console.log(`response error:`, error);
        }
        if (error.response.status === 401) {
          // This needs to be fixed. We need to incorporate user email and server match
          // removeAuthFromLocalStorage();
          // We need to place an expiry callback
          if (autoReauthenticateUser) {
            reAuthenticateUserNotSupported();
          }
        }
        return Promise.reject(error);
      })
}

export const unsetAxiosAuthToken = () => {
  if (gRequestInterceptor !== null) {
    // console.log(`unsetAxiosAuthToken: eject gRequestInterceptor`);
    axiosApiInstance.interceptors.request.eject(gRequestInterceptor);
  }

  if (gResponseInterceptor !== null) {
    // console.log(`unsetAxiosAuthToken: eject gResponseInterceptor`);
    axiosApiInstance.interceptors.response.eject(gResponseInterceptor);
  }
}