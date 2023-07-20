import axios from 'axios';
import {serverApiBaseUrl} from "../config/global";

export const axiosApiInstance = axios.create({
  baseURL: serverApiBaseUrl
})