import axios, { AxiosError } from "axios";

//middlewares, error checking, etc

//error handle interceptor
axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let err = error.response?.data as any; //cast error data so it's easier to use
    if (err?.message)
      throw err; //if there's a message field, assume response data as the error itself
    else if (error.response?.status === 400) {
      //for bad request errors
      for (const key in err) {
        //iterate through field's validator errors
        if (Object.prototype.hasOwnProperty.call(error.response.data, key)) {
          const element = err[key];
          throw element; //throw first field validator error as the resultant error
        }
      }
    } else throw error; //do nothing and throw the original error
  }
);

export default axios;
