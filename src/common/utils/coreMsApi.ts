import {
  ACCESS_TOKEN_KEY,
  CoreMsApiConfig,
  CoreMsApiResonse,
  HttpMethod,
} from "@/common/model/CoreMsApiModel";
import axios, { AxiosError } from "axios";

class CoreMsApi {
  private axios;
  private config: CoreMsApiConfig;

  public constructor(config: CoreMsApiConfig) {
    this.config = config;
    this.axios = axios.create({ baseURL: config.baseURL });
  }

  public async apiRequest<T>(
    method: HttpMethod,
    url: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<CoreMsApiResonse<T>> {
    const response: CoreMsApiResonse<T> = {
      result: false,
      response: null as T,
      errors: [],
    };
    try {
      const res = await this.axios.request<T>({
        method,
        url,
        data,
        headers: { ...this.getDefaultHeaders(), ...(headers ?? {}) },
      });

      response.result = true;
      response.response = res.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        response.errors = error.response.data.errors;
      } else {
        console.error(error);
        response.errors = [
          {
            reasonCode: "unknown.error",
            description: "Unknown error. Please try again later.",
          },
        ];
      }
    }

    console.debug(response);
    return response;
  }

  private getDefaultHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return headers;
  }
}

export default CoreMsApi;
