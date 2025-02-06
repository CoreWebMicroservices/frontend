export interface ApiSuccessfulResponse {
  result: boolean;
}

export interface CoreMsApiError {
  reasonCode: string;
  description: string;
  details?: string;
}

export interface CoreMsApiConfig {
  baseURL: string;
  useAccessToken?: boolean;
}

export interface CoreMsApiResonse<T> {
  result: boolean;
  response: T;
  errors: CoreMsApiError[];
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export const REFRESH_TOKEN_KEY = "refreshToken";
export const ACCESS_TOKEN_KEY = "accessToken";

export enum AuthErrorReasonCode {
  PROVIDED_VALUE_INVALID = "provided.value.invalid",
}
