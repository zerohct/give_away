import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import registerBackground from "../assets/images/q.png";
import logo from "../assets/images/GiveAway_logo.png";
import appConfig from "../config/appConfig";
import Head from "next/head";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user has admin role and redirect accordingly
      if (user.role === "admin") {
        router.push("/admin/");
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, user, router]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

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
        const loginData = { email, password };
        await login(loginData);
        // Redirect will happen in the useEffect hook based on user role
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, login]
  );

  // Charity-focused features
  const charityValues = [
    {
      title: "Tình Nguyện",
      description: "Mỗi hoạt động đều xuất phát từ tấm lòng",
      icon: (
        <svg
          className="w-10 h-10 text-amber-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
    {
      title: "Cộng Đồng",
      description: "Kết nối những tấm lòng hảo tâm",
      icon: (
        <svg
          className="w-10 h-10 text-amber-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
        </svg>
      ),
    },
    {
      title: "Minh Bạch",
      description: "Mọi hoạt động đều được công khai",
      icon: (
        <svg
          className="w-10 h-10 text-amber-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>
          Đăng nhập | {appConfig.site.name} - Nền tảng từ thiện minh bạch
        </title>
        <meta
          name="description"
          content="Đăng nhập vào tài khoản {appConfig.site.name} của bạn để tham gia các hoạt động từ thiện, quyên góp và theo dõi các dự án hỗ trợ cộng đồng."
        />
        <meta
          name="keywords"
          content="đăng nhập, tài khoản từ thiện, quyên góp, hỗ trợ cộng đồng, {appConfig.site.name}"
        />
        <meta property="og:title" content="Đăng nhập | {appConfig.site.name}" />
        <meta
          property="og:description"
          content="Đăng nhập vào tài khoản {appConfig.site.name} của bạn để tham gia các hoạt động từ thiện, quyên góp và theo dõi các dự án hỗ trợ cộng đồng."
        />
        <meta property="og:image" content={logo.src} />
        <link rel="canonical" href={`${appConfig.site.url}/login`} />
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex justify-center">
              <img
                src={logo.src}
                alt={`${appConfig.site.name} Logo`}
                className="h-20 transition-all duration-300 hover:scale-105"
                width="80"
                height="80"
              />
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                Đăng nhập
              </h1>
              <p className="text-center text-gray-600 mb-6">
                Chào mừng bạn quay trở lại với GiveAway
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your-email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="email"
                    className="block w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors duration-200"
                    aria-label="Email đăng nhập"
                  />
                </div>

                <div className="space-y-2 relative">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Mật khẩu
                  </label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="block w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors duration-200"
                    aria-label="Mật khẩu đăng nhập"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center top-8 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clipRule="evenodd"
                        />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Ghi nhớ đăng nhập
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="/forgot-password"
                      className="font-medium text-amber-600 hover:text-amber-500 transition-colors duration-200"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-amber-400 disabled:cursor-not-allowed transition-colors duration-200"
                  aria-label="Đăng nhập vào tài khoản"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Chưa có tài khoản?{" "}
                  <a
                    href="/register"
                    className="font-medium text-amber-600 hover:text-amber-500 transition-colors duration-200"
                  >
                    Đăng ký ngay
                  </a>
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="grid grid-cols-3 gap-4">
                {charityValues.map((value, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">{value.icon}</div>
                    <h3 className="text-sm font-semibold text-gray-700">
                      {value.title}
                    </h3>
                    <p className="text-xs text-gray-500">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src={registerBackground.src}
            alt={`${appConfig.site.name} Community`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-amber-600/70 flex items-center">
            <div className="px-12 max-w-lg">
              <h1 className="text-4xl font-bold text-white mb-4">
                Chào mừng bạn đến với {appConfig.site.name}
              </h1>
              <p className="text-xl text-white opacity-90 mb-6">
                {appConfig.site.description}
              </p>
              <div className="flex space-x-4">
                <a
                  href="/register"
                  className="inline-block px-6 py-3 border-2 border-white text-white font-medium text-base leading-tight rounded-lg hover:bg-white hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-amber-800 transition-colors duration-200"
                >
                  Đăng ký ngay
                </a>
                <a
                  href="/about-us"
                  className="inline-block px-6 py-3 bg-white text-amber-700 font-medium text-base leading-tight rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-amber-800 transition-colors duration-200"
                >
                  Tìm hiểu thêm
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
