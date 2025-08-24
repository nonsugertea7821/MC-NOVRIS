import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { NovrisAuthUrl } from '../api/novrisUrl';

const DEFAULT_BACKEND_APPLICATION_PORT = 8080 as const;

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

class AxiosHelper {

    private ip: string | undefined;
    private jwtToken: string | undefined;

    /**
     * 接続先IPアドレスを設定する。
     * @param ip 接続先IPアドレス
     */
    setIp(ip: string) {
        this.ip = ip;
    }

    /**
     * jwtトークンを設定する。
     * @param jwtToken jwtトークン
     */
    setJwtToken(jwtToken: string) {
        this.jwtToken = jwtToken;
    }

    /**
     * 認証URLかどうかを判定する。
     * @param url URL
     * @returns 認証URLならTrue
     */
    private isAuthUrl(url: string): boolean {
        return Object.values(NovrisAuthUrl).includes(url as typeof NovrisAuthUrl[keyof typeof NovrisAuthUrl]);
    }

    /**
     * ドメイン部分のURLを作成する。
     * @returns URL
     */
    private createDomainURL() {
        if (this.ip) {
            return `http://${this.ip}:${DEFAULT_BACKEND_APPLICATION_PORT}`;
        }
    }

    /**
     * HTTPヘッダーを作成する。
     * @param url URL
     * @param config AxiosRequestConfig
     * @returns HTTPヘッダー
     */
    private createRequestHeaders(url: string, config?: AxiosRequestConfig) {
        const headers = {
            ...(config?.headers ?? {}),
        };
        // 非認証APIでjwtTokenが設定されている場合は認証情報を指定する。
        if (this.jwtToken && !this.isAuthUrl(url)) {
            headers['Authorization'] = `Bearer ${this.jwtToken}`;
        }
        return headers;
    }

    /**
     * Axiosリクエストラッパー
     * @param method HTTPメソッド
     * @param url URL
     * @param config AxiosRequestConfig
     * @returns Promise<AxiosResponse<T>>
     */
    private async request<T = any>(
        method: HttpMethod,
        url: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        const baseURL = this.createDomainURL();
        const headers = this.createRequestHeaders(url, config);
        return await axios.request<T>({
            method,
            url,
            baseURL,
            headers,
            ...config
        });
    }

    /**
     * GET
     * @description
     * 戻り値の有るリクエストで使用します。
     * @template T 戻り値の型
     * @param url NovrisUrl
     * @param data any
     * @param config AxiosRequestConfig
     * @returns Promise<AxiosResponse<T, any>>
     */
    get<T = any>(url: string, config?: AxiosRequestConfig) {
        return this.request<T>('get', url, config);
    }

    /**
     * POST
     * @description
     * 引数と戻り値の有るリクエストで使用します。
     * @template T 戻り値の型
     * @param url NovrisUrl
     * @param data any
     * @param config AxiosRequestConfig
     * @returns Promise<AxiosResponse<T, any>>
     */
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.request<T>('post', url, { ...config, data });
    }

    /**
     * PUT
     * @description
     * 引数が有り戻り値の無いリクエストで使用します。\
     * CORSによってContent-Typeが上書きされる事象を避けるためクエリパラメータを使用して下さい。
     * @template T 戻り値の型
     * @param url NovrisUrl
     * @param data クエリパラメータ
     * @param config AxiosRequestConfig
     * @returns Promise<AxiosResponse<T, any>>
     */
    put<T = any>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig) {
        return this.request<T>('put', url, { ...config, params: data });
    }

    /**
     * DELETE
     * @description
     * サーバー側のリソースを削除するリクエストで使用します。
     * @param url NovrisUrl
     * @param config AxiosRequestConfig
     * @returns Promise<AxiosResponse<any, any>>
     */
    delete(url: string, config?: AxiosRequestConfig) {
        return this.request('delete', url, config);
    }
}

/** Axiosリクエストヘルパー */
export const axiosHelper = new AxiosHelper();