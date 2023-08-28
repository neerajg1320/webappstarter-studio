import axios from 'axios';
import {autoReauthenticateUser, debugAxios, debugOptimizationMarker, serverApiBaseUrl} from "../config/global";
import {reAuthenticateUserNotSupported} from "../state/action-creators";

export const axiosInstance = axios.create({
  // baseURL: serverMediaBaseUrl
});

export const axiosApiInstance = axios.create({
  baseURL: serverApiBaseUrl
});



export const setAxiosAuthToken = (jwtToken: string) => {
  if (debugAxios) {
    console.log(`setAuthentication: jwtToken:`, jwtToken);
  }

  axiosApiInstance.interceptors.request.use(request => {
      if (debugAxios) {
        console.log(`request intercepted:`, request);
      }

      // The following is a workaround
      // The axios library has a bug around applying headers in middleware.
      // The headers are applied to all instances.
      // In fact the other vars like baseUrl are also applied to all instances
      const skippedUrls = ['/mediafiles', '/api/v1/auth'].filter(item => request.url?.includes(item));
      if (skippedUrls.length > 0) {
        if (debugOptimizationMarker) {
          console.log(`Token skipped for url '${skippedUrls}' Need to put a better solution`);
        }
      } else {
        request.headers['Authorization'] = `Bearer ${jwtToken}`;
      }

      return request;
    },
    error => {
      if (debugAxios) {
        console.log(`request error:`, error);
      }
      return Promise.reject(error);
    }
  )

  axiosApiInstance.interceptors.response.use(response => {
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
          // The following will re-authenticate the user
          if (autoReauthenticateUser) {
            reAuthenticateUserNotSupported();
          }
        }
        return Promise.reject(error);
      })
}

export const unsetAuthentication = () => {
  axiosApiInstance.interceptors.request.use(config => {
      delete config.headers['Authorization'];
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  )
}