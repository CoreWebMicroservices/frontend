import { hookstate, useHookstate } from "@hookstate/core";
import { devtools } from "@hookstate/devtools";
import { jwtDecode } from "jwt-decode";

import { USER_API_BASE_URL } from "@/user/config";
import CoreMsApi from "@/common/utils/api/CoreMsApi";
import {
  ACCESS_TOKEN_KEY,
  ApiSuccessfulResponse,
  CoreMsApiResonse,
  HttpMethod,
  REFRESH_TOKEN_KEY,
} from "@/common/model/CoreMsApiModel";
import {
  AccessTokenResponse,
  SignInUserRequest,
  SignUpUserRequest,
  Token,
  TokenResponse,
} from "@/user/model/Auth";
import { User } from "@/user/model/User";

const userMsApi = new CoreMsApi({ baseURL: USER_API_BASE_URL });

interface AuthState {
  isAuthenticated: boolean;
  isInProgress: boolean;
  accessToken?: string;
  refreshToken?: string;
  parsedRefreshToken?: Token;
  user?: User;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInProgress: false,
};

const authState = hookstate(initialState, devtools({ key: "auth" }));

export function useAuthState() {
  return useHookstate(authState);
}

export async function signInUser(
  signInRequest: SignInUserRequest
): Promise<CoreMsApiResonse<TokenResponse>> {
  authState.isInProgress.set(true);
  const signInReponse = await userMsApi.apiRequest<TokenResponse>(
    HttpMethod.POST,
    "/api/auth/signin",
    {
      email: signInRequest.email,
      password: signInRequest.password,
    }
  );
  authState.isInProgress.set(false);

  if (signInReponse.result === true) {
    const { accessToken, refreshToken } = signInReponse.response;
    const parsedRefreshToken = jwtDecode(refreshToken) as Token;

    authState.merge({
      isAuthenticated: true,
      accessToken,
      refreshToken,
      parsedRefreshToken,
    });

    setRefreshToken(refreshToken);
    setAccessToken(accessToken);
  }

  return signInReponse;
}

export async function signUpUser(
  signUpRequest: SignUpUserRequest
): Promise<CoreMsApiResonse<ApiSuccessfulResponse>> {
  authState.isInProgress.set(true);

  const res = await userMsApi.apiRequest<ApiSuccessfulResponse>(
    HttpMethod.POST,
    "/api/auth/signup",
    signUpRequest
  );

  authState.isInProgress.set(false);
  return res;
}

export async function signOut() {
  const res = await userMsApi.apiRequest<ApiSuccessfulResponse>(
    HttpMethod.POST,
    "/api/auth/signout",
    null,
    { Authorization: `Bearer ${authState.refreshToken.get()}` }
  );

  if (res.result === false) {
    console.error("Sign out failed", res.errors);
  }

  authState.merge({
    isAuthenticated: false,
    accessToken: undefined,
    refreshToken: undefined,
    parsedRefreshToken: undefined,
    user: undefined,
  });

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.location.href = "/";
}

const setRefreshToken = (refreshToken: string | null) => {
  if (!refreshToken) return false;

  try {
    authState.parsedRefreshToken.set(jwtDecode<Token>(refreshToken));
    const currentTime = Date.now() / 1000;
    const exp = authState.parsedRefreshToken.get()?.exp || 0;
    console.debug("Refresh token parsed", exp, currentTime);
    if (exp < currentTime) {
      console.error("Refresh token expired");
      signOut();
      return false;
    }
  } catch (error) {
    console.error("Invalid refresh token", error);
    signOut();
    return false;
  }

  const tokenInfo = authState.parsedRefreshToken.get();
  if (!tokenInfo) return false;

  authState.merge({
    isInProgress: false,
    isAuthenticated: true,
    refreshToken,
    user: {
      id: tokenInfo.sub,
      email: tokenInfo.email,
      firstName: tokenInfo.first_name,
      lastName: tokenInfo.last_name,
      roles: tokenInfo.roles,
    } as User,
  });

  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

  return true;
};

const setAccessToken = async (
  accessToken: string | null,
  force: boolean = false
) => {
  if (!authState.refreshToken.get()) return false;

  if (!accessToken || force) {
    const tokenResponse = await userMsApi.apiRequest<AccessTokenResponse>(
      HttpMethod.POST,
      "/api/auth/refresh-token",
      null,
      { Authorization: `Bearer ${authState.refreshToken.get()}` }
    );

    if (tokenResponse.result === true) {
      accessToken = tokenResponse.response.accessToken;
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken as string);
    } else {
      console.error("Failed to refresh token", tokenResponse.errors);
      signOut();
      return false;
    }
  } else {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  const parsedAccessToken = jwtDecode<Token>(accessToken as string);
  const expiresIn = parsedAccessToken.exp * 1000 - Date.now();

  console.debug(
    "Access token refreshed, expire in ",
    expiresIn / 60000,
    "minutes"
  );

  setTimeout(() => {
    const res = setAccessToken(accessToken, true);
    if (!res) {
      signOut();
    }
  }, Math.max(expiresIn - 30000, 0)); // Refresh 30s before expiration

  return true;
};

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");
if (token) {
  setRefreshToken(token);
  urlParams.delete("token");
  window.location.search = urlParams.toString();
  setAccessToken(null);
} else {
  setRefreshToken(localStorage.getItem(REFRESH_TOKEN_KEY));
  setAccessToken(localStorage.getItem(ACCESS_TOKEN_KEY));
}
