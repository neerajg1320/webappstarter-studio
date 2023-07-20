import axios from 'axios';
import {serverApiBaseUrl} from "../config/global";

export const axiosApiInstance = axios.create({
  baseURL: serverApiBaseUrl
})

export interface AxiosInterceptorHeaders {
  Authorization?: string;
}

// const axiosInterceptorHeaders:AxiosInterceptorHeaders = {};

export const setAuthentication = (jwtToken: string) => {
  console.log(`setAuthentication: jwtToken:`, jwtToken);
  // if (jwtToken) {
  //   axiosInterceptorHeaders['Authorization'] = `Bearer ${jwtToken}`
  // }

  axiosApiInstance.interceptors.request.use(config => {
      config.headers['Authorization'] = `Bearer ${jwtToken}`;
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  )
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