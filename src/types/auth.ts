export type UserRole =
  | "ADMIN"
  | "CUSTOMER"
  | "RESTAURANT_OWNER"
  | "DELIVERY_PARTNER";

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginData {
  token: string;
  username: string;
  role: UserRole;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  password: string;
  phoneNumber: number;
  userRole: UserRole;
  address: Address;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: number;
  address: Address;
  userRole: UserRole;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
}