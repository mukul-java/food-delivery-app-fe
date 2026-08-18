// ------- Shared -------

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
  country?: string;
  zipcode?: string; // Backend sometimes sends lowercase C
}

// ------- Auth -------

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginData {
  token: string;
  username: string;
  role: UserRole;
  id?: string | number;
  email?: string;
  address?: Address;
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

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface UpdateUserRequest {
  id: number;
  username: string;
  fullName: string;
  phoneNumber: number;
  address: Address;
}

// ------- Delivery Agent -------

export interface DeliveryAgent {
  id: number;
  name: string;
  phoneNumber: number;
  available: boolean;
  currentLocation?: string;
}