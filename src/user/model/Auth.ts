export interface SignInUserRequest {
  email: string;
  password: string;
}

export interface SignUpUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
}

export interface TokenResponse {
  refreshToken: string;
  accessToken: string;
}

export interface AccessTokenResponse {
  accessToken: string;
}

export interface Token {
  sub: string; // User ID here
  email: string;
  user_uuid: string;
  first_name: string;
  last_name: string;
  roles: string[];
  exp: number;
  iat: number;
}

export interface VerifyEmailRequest {
  email: string;
  token: string;
}

export interface VerifyPhoneRequest {
  phoneNumber: string;
  code: string;
}

export interface ResendVerificationRequest {
  email: string;
  type: 'EMAIL' | 'SMS';
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}
