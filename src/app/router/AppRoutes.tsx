import { RouteObject } from "react-router-dom";
import { createAuthGuards } from "@/common/router/AuthGuards";
import { AppRoles } from "@/common/AppRoles";
import { ROUTE_PATHS } from "@/app/router/routes";
import { getCurrentUserAuth, hasAnyRole } from "@/user/store/AuthState";

// Import components directly from modules (no route configuration)
import AuthForm from "@/user/component/auth/AuthForm";
import ForgotPasswordForm from "@/user/component/auth/ForgotPasswordForm";
import ResetPasswordForm from "@/user/component/auth/ResetPasswordForm";
import VerifyEmailForm from "@/user/component/auth/VerifyEmailForm";
import VerifyPhoneForm from "@/user/component/auth/VerifyPhoneForm";
import UserProfile from "@/user/component/profile/UserProfile";
import UserList from "@/user/component/user/UserList";
import AppUserEdit from "@/app/layout/components/UserEdit";
import UserAdd from "@/user/component/user/UserAdd";
import { MessageList } from "@/communication/component/MessageList";
import TranslationEditor from "@/translation/component/TranslationEditor";
import { TranslationList } from "@/translation/component/TranslationList";
import DocumentList from "@/document/component/DocumentList";

// Create auth guards with dependency injection
const authGuards = createAuthGuards({
  homeRoute: ROUTE_PATHS.HOME,
  loginRoute: ROUTE_PATHS.LOGIN,
  authFunctions: {
    getCurrentUserAuth,
    hasAnyRole,
  },
});

/**
 * Centralized route configuration for the entire application
 * This file composes all module components into routes
 */

// Core application routes
export const coreRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.HOME,
    element: <div>HOME</div>,
  },
  {
    path: ROUTE_PATHS.FEATURES,
    element: <div>Features</div>,
    loader: authGuards.redirectIfNotAuthenticated,
  },
];

// User module routes (moved from UserRouter)
export const userRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.LOGIN,
    element: <AuthForm />,
    loader: authGuards.redirectIfAuthenticated,
  },
  {
    path: ROUTE_PATHS.FORGOT_PASSWORD,
    element: <ForgotPasswordForm />,
    loader: authGuards.redirectIfAuthenticated,
  },
  {
    path: ROUTE_PATHS.RESET_PASSWORD,
    element: <ResetPasswordForm />,
    loader: authGuards.redirectIfAuthenticated,
  },
  {
    path: ROUTE_PATHS.VERIFY_EMAIL,
    element: <VerifyEmailForm />,
    loader: authGuards.redirectIfAuthenticated,
  },
  {
    path: ROUTE_PATHS.VERIFY_PHONE,
    element: <VerifyPhoneForm />,
    loader: authGuards.redirectIfAuthenticated,
  },
  {
    path: ROUTE_PATHS.USER_PROFILE,
    element: <UserProfile />,
    loader: authGuards.redirectIfNotAuthenticated,
  },
  {
    path: ROUTE_PATHS.USERS_LIST,
    element: <UserList />,
    loader: authGuards.redirectIfNotInRole([AppRoles.UserMsAdmin]),
  },
  {
    path: ROUTE_PATHS.USER_ADD,
    element: <UserAdd />,
    loader: authGuards.redirectIfNotInRole([AppRoles.UserMsAdmin]),
  },
  {
    path: ROUTE_PATHS.USER_EDIT,
    element: <AppUserEdit />,
    loader: authGuards.redirectIfNotInRole([AppRoles.UserMsAdmin]),
  },
];

// Communication module routes
export const communicationRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.COMMUNICATION,
    element: <MessageList />,
    loader: authGuards.redirectIfNotAuthenticated,
  },
];

export const translationRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.TRANSLATIONS,
    element: <TranslationList />,
    loader: authGuards.redirectIfNotInRole([AppRoles.TranslationMsAdmin]),
  },
  {
    path: ROUTE_PATHS.TRANSLATION_EDIT,
    element: <TranslationEditor />,
    loader: authGuards.redirectIfNotInRole([AppRoles.TranslationMsAdmin]),
  },
  {
    path: ROUTE_PATHS.TRANSLATION_NEW,
    element: <TranslationEditor />,
    loader: authGuards.redirectIfNotInRole([AppRoles.TranslationMsAdmin]),
  },
];

// Document module routes
export const documentRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.DOCUMENTS,
    element: <DocumentList />,
    loader: authGuards.redirectIfNotAuthenticated,
  },
];

// Combined routes for the entire application
export const allApplicationRoutes: RouteObject[] = [
  ...coreRoutes,
  ...userRoutes,
  ...communicationRoutes,
  ...translationRoutes,
  ...documentRoutes,
];