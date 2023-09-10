import {AxiosError, AxiosResponse} from "axios";

export const axiosErrorToErrorList = (err:AxiosError<any,any>, showErrKey:boolean=false):string[] => {
  const errors = [];
  for (const item in err.response?.data) {
    // console.log(item, err.response?.data[item]);
    for (const msg of err.response?.data[item]) {
      errors.push(`${showErrKey ? item+': ' : ''}${msg}`);
    }
  }

  return errors;
}

export const axiosResponseToStringList = (response:AxiosResponse<any,any>, showErrKey:boolean=false):string[] => {
  const messages = [];
  for (const item in response.data) {
    // console.log(item, err.response?.data[item]);
    messages.push(`${showErrKey ? item+': ' : ''}${response.data[item]}`);
  }

  return messages;
}

