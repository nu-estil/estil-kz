import axios, { AxiosRequestConfig } from 'axios';
import axiosRetry, { IAxiosRetryConfig } from 'axios-retry';

export const makeAxiosInstance = <T = any>(
    config: AxiosRequestConfig<T>,
    retryConfig: IAxiosRetryConfig,
) => {
    const instance = axios.create(config);
    axiosRetry(instance, { retries: 1, ...retryConfig });
    return instance;
};
