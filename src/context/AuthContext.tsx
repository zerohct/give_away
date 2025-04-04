import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthResponse, LoginDTO, RegisterDTO } from "../types/AuthType";
import { AuthService } from "../services/AuthService";
import { toast } from "react-toastify";

interface AuthContextType {
  user: AuthResponse["user"] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("accessToken");

      if (storedUser && storedUser !== "undefined") {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (
            parsedUser &&
            typeof parsedUser === "object" &&
            "email" in parsedUser
          ) {
            setUser(parsedUser);
            setIsAuthenticated(true);

            if (storedToken) {
              await checkAuth();
            }
          } else {
            console.error(
              "Dữ liệu người dùng trong localStorage không hợp lệ:",
              parsedUser
            );
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
          }
        } catch (error) {
          console.error(
            "Không thể phân tích dữ liệu người dùng từ localStorage:",
            error
          );
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
        }
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginDTO) => {
    try {
      const response = await AuthService.login(data);
      if (!response.user.role) {
        response.user.role = "user"; // Set default role if not provided
      }
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success("Đăng nhập thành công!");
    } catch (error: any) {
      const errorMessage =
        error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (data: RegisterDTO) => {
    try {
      const response = await AuthService.register(data);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success("Đăng ký thành công!");
    } catch (error: any) {
      const errorMessage =
        error.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    AuthService.logout();
  };

  const checkAuth = async () => {
    try {
      const response = await AuthService.getProfile();
      setUser(response);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Kiểm tra trạng thái đăng nhập thất bại:", error);
      logout();
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};
