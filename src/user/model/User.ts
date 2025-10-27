export enum UserRole {
  Admin = "ADMIN",
  User = "USER",
}

export enum AuthProvider {
  google = "google",
  github = "github",
  linkedin = "linkedin",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  roles: UserRole[];
}
