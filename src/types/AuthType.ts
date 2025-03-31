export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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

export interface AuthContextType {
  user: AuthResponse["user"] | null;
  isAuthenticated: boolean;
  login: (data: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => void;
}
// types/AuthType.ts

// Định nghĩa kiểu dữ liệu cho phản hồi từ API
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  success?: boolean; // Tùy chọn, nếu API trả về trường này
  error?: string; // Tùy chọn, nếu API trả về trường này
}

// Định nghĩa kiểu dữ liệu cho thông tin người dùng
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username?: string | null;
  phone?: string;
  status?: string;
  role: string; // Make sure the role property is included here
}

// Định nghĩa kiểu dữ liệu cho phản hồi từ API đăng nhập/đăng ký
export interface AuthResponseData {
  user: User;
  accessToken: string;
}

export interface AuthResponse extends ApiResponse<AuthResponseData> {}

// Định nghĩa kiểu dữ liệu cho dữ liệu đăng nhập
export interface LoginDTO {
  email: string;
  password: string;
}

// Định nghĩa kiểu dữ liệu cho dữ liệu đăng ký
export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}
