import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const MAX_REQUESTS_COUNT = 100;
const INTERVAL_MS = 10;

/**
 * The scrapers (by default) try to make a lot of HTTP requests, and too many at once cause some
 * to start failing with weird errors. To fix this, limit the in-flight request count.
 *
 * Taken from https://medium.com/@matthew_1129/axios-js-maximum-concurrent-requests-b15045eb69d0
 *
 * See axios documentation on interceptors: https://axios-http.com/docs/interceptors
 */
export const createInterceptors = () => {
  let PENDING_REQUESTS = 0; // create new axios instance
  // const api = axios.create({})

  const requestInterceptor = (config: AxiosRequestConfig) => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
          PENDING_REQUESTS++;
          clearInterval(interval);
          resolve(config);
        }
      }, INTERVAL_MS);
    });
  };

  const responseSuccessInterceptor = (response: AxiosResponse) => {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
    return Promise.resolve(response);
  };
  const responseFailureIntercepture = (error: unknown) => {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
    return Promise.reject(error);
  };

  // todo: use an axios instance rather than modifying global defaults
  const requestId = axios.interceptors.request.use(requestInterceptor);
  const responseId = axios.interceptors.response.use(
    responseSuccessInterceptor,
    responseFailureIntercepture
  );
  return () => {
    axios.interceptors.request.eject(requestId);
    axios.interceptors.response.eject(responseId);
  };
};
