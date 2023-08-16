import {AxiosError} from "axios";

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
