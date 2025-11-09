// Configurations for the user module
import { APP_BASE_URL } from "@/config";
import { APP_ROUTES } from "@/app/router/routes";

export const USER_API_BASE_URL = import.meta.env.REACT_USER_API_BASE_URL;

export const ROUTE_OAUTH2_SUCCESS_PATH = APP_ROUTES.LOGIN;

export const OAUTH2_REDIRECT_URI = APP_BASE_URL + ROUTE_OAUTH2_SUCCESS_PATH;

export const GOOGLE_AUTH_URL =
  USER_API_BASE_URL +
  "/oauth2/authorize/google?redirect_uri=" +
  OAUTH2_REDIRECT_URI;

export const GITHUB_AUTH_URL =
  USER_API_BASE_URL +
  "/oauth2/authorize/github?redirect_uri=" +
  OAUTH2_REDIRECT_URI;

export const LINKEDIN_AUTH_URL =
  USER_API_BASE_URL +
  "/oauth2/authorize/linkedin?redirect_uri=" +
  OAUTH2_REDIRECT_URI;
