import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { NovrisAuthUrl } from '../api/novrisUrl';

const backendApplicationPort = 8080 as const;

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

class AxiosHelper {

    private ip: string | undefined;
    private jwtToken: string | undefined;

    setIp(targetIp: string) {
        this.ip = targetIp;
    }

    setJwtToken(jwtToken: string) {
        this.jwtToken = jwtToken;
    }

    private getBaseURL() {
        if (this.ip) {
            return `http://${this.ip}:${backendApplicationPort}`;
        }
    }

    private isAuthUrl(url: string): boolean {
        return Object.values(NovrisAuthUrl).includes(url as typeof NovrisAuthUrl[keyof typeof NovrisAuthUrl]);
    }

    private async request<T = any>(
        method: HttpMethod,
        url: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        const baseURL = this.getBaseURL();
        const headers = {
            ...(config?.headers ?? {}),
        };
        if (this.jwtToken && !this.isAuthUrl(url)) {
            headers['Authorization'] = `Bearer ${this.jwtToken}`;
        }
        return await axios.request<T>({
            method,
            url,
            baseURL,
            headers,
            ...config,
        });
    }

    async get<T = any>(url: string, config?: AxiosRequestConfig) {
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