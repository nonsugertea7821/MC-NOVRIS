import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getRecoil } from "recoil-nexus";
import { targetIpState } from "../recoil/atom/authAtoms";

type HttpMethod = "get" | "post" | "put" | "delete";

class AxiosHelper {
    private getBaseURL() {
        const ip = getRecoil(targetIpState);
        return `http://${ip}`;
    }

    private request<T = any>(
        method: HttpMethod,
        url: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        const baseURL = this.getBaseURL();
        return axios.request<T>({
            method,
            url,
            baseURL,
            ...config,
        });
    }

    get<T = any>(url: string, config?: AxiosRequestConfig) {
        return this.request<T>("get", url, config);
    }

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.request<T>("post", url, { ...config, data });
    }

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.request<T>("put", url, { ...config, data });
    }

    delete<T = any>(url: string, config?: AxiosRequestConfig) {
        return this.request<T>("delete", url, config);
    }
}

export const axiosHelper = new AxiosHelper();