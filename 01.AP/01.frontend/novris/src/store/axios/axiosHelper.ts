import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getRecoil } from 'recoil-nexus';
import { NovrisAuthUrl } from '../api/novrisUrl';
import { jwtState, targetIpState } from '../recoil/atom/authAtoms';

const backendApplicationPort = 8080 as const;

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

class AxiosHelper {
    private getBaseURL() {
        const ip = getRecoil(targetIpState);
        return `http://${ip}:${backendApplicationPort}`;
    }

    private getJwt() {
        return getRecoil(jwtState);
    }

    private isAuthUrl(url: string): boolean {
        return Object.values(NovrisAuthUrl).includes(url as typeof NovrisAuthUrl[keyof typeof NovrisAuthUrl]);
    }

    private request<T = any>(
        method: HttpMethod,
        url: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        const baseURL = this.getBaseURL();
        const jwt = this.getJwt();

        const headers = {
            ...(config?.headers ?? {}),
        };

        if (jwt && !this.isAuthUrl(url)) {
            headers['Authorization'] = `Bearer ${jwt}`;
        }

        return axios.request<T>({
            method,
            url,
            baseURL,
            headers,
            ...config,
        });
    }

    get<T = any>(url: string, config?: AxiosRequestConfig) {
        return this.request<T>('get', url, config);
    }

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.request<T>('post', url, { ...config, data });
    }

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.request<T>('put', url, { ...config, data });
    }

    delete<T = any>(url: string, config?: AxiosRequestConfig) {
        return this.request<T>('delete', url, config);
    }
}

export const axiosHelper = new AxiosHelper();