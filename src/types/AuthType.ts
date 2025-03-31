export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    fullName: string;
    role: string;
  };
  accessToken: string;
}

export interface AuthContextType {
  user: AuthResponse["user"] | null;
  isAuthenticated: boolean;
  login: (data: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => void;
}
