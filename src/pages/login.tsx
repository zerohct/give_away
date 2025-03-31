import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthService } from "../services/AuthService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import registerBackground from "../assets/images/q.png";
import logo from "../assets/images/GiveAway_logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null); // Store user information
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
  
    if (storedUser) {
      try {
        // Thử phân tích JSON
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        // Nếu có lỗi trong việc phân tích, log lỗi và không làm gì cả
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  

  // Validate email format
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle login form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Validate email and password
      if (!email || !password) {
        toast.error("Vui lòng nhập đầy đủ email và mật khẩu.");
        return;
      }

      if (!validateEmail(email)) {
        toast.error("Email không hợp lệ.");
        return;
      }

      setIsLoading(true);

      try {
        // Send login request to the backend
        const loginData = { email, password };
        const response = await AuthService.login(loginData);

        if (response) {
          toast.success("Đăng nhập thành công!");

          // Save user data and token to localStorage
          localStorage.setItem("user", JSON.stringify(response.user));

          setUser(response.user); // Update user state
          router.push("/"); // Redirect to the home page after successful login
        }
      } catch (error: any) {
        const errorMessage =
          error?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
        toast.error(errorMessage);
        console.error("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, router]
  );

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data from localStorage
    setUser(null); // Reset user state
    toast.success("Đăng xuất thành công!");
    router.push("/login"); // Redirect to the login page
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="flex min-h-screen">
        {/* Left Section - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <div className="mb-10 flex justify-center">
              <img src={logo.src} alt="GiveAway Logo" className="h-16" />
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                Đăng nhập
              </h2>

              {user ? (
                // Display logged-in state
                <div>
                  <p className="text-center">Chào, {user.name}!</p>
                  <button
                    onClick={handleLogout}
                    className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="your-email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Mật khẩu
                    </label>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src={registerBackground.src}
            alt="GiveAway Community"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/60 flex items-center">
            <div className="px-12 max-w-lg">
              <h1 className="text-4xl font-bold text-white mb-4">
                Chào mừng bạn đến với GiveAway
              </h1>
              <h2 className="text-2xl text-white opacity-90 mb-8">
                Hãy cùng chúng tôi tạo nên sự khác biệt!
              </h2>
              <a
                href="/register"
                className="inline-block px-6 py-3 border-2 border-white text-white font-medium text-base leading-tight rounded-lg hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-blue-800 transition-colors duration-200"
              >
                Đăng ký ngay
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
