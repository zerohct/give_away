import { User } from "./user";
import { ApiResponse } from "./api";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
}

export interface AuthResponse extends ApiResponse<AuthResponseData> {}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => void;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phone?: string;
    avatar?: string;
    status?: string;
  };
  accessToken: string;
}
