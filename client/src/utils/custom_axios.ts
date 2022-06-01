import axios, { AxiosError } from "axios";

//middlewares, error checking, etc
axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.log({ error1: error });

    let err = error.response?.data as any;
    console.log({ error });
    console.log({ err });
    console.log(error.response);
    console.log(error.response?.data);
    if (err?.message) throw err;
    else if (error.response?.status === 400) {
      for (const key in err) {
        if (Object.prototype.hasOwnProperty.call(error.response.data, key)) {
          const element = err[key];
          console.log({ element, key });
          throw element;
        }
      }
    } else throw error;
  }
);

export default axios;
