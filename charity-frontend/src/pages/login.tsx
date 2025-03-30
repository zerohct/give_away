import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { AuthService } from '../services/AuthService'; // Import AuthService
import { toast } from 'react-toastify'; // Import toast để hiển thị thông báo
import registerBackground from "../assets/images/q.png"; // Thay thế bằng đường dẫn hình ảnh thực tế của bạn
import logo from "../assets/images/GiveAway_logo.png";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
        toast.error('Vui lòng nhập đầy đủ email và mật khẩu.');
        return;
      }

      if (!validateEmail(email)) {
        toast.error('Email không hợp lệ.');
        return;
      }

      setIsLoading(true);

      try {
        // Gửi yêu cầu đăng nhập đến backend
        const loginData = { email, password };
        const response = await AuthService.login(loginData);

        if (response) {
          toast.success('Đăng nhập thành công!');
          router.push('/'); // Chuyển hướng đến trang chủ sau khi đăng nhập thành công
        }
      } catch (error: any) {
        // Xử lý lỗi từ backend
        const errorMessage = error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
        toast.error(errorMessage);
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, router],
  );

  return (
    <div className="giveaway-login-container">
      <div className="login-left-section">
        <div className="login-content">
          <div className="login-logo">
            <img src={logo.src} alt="GiveAway Logo" />
          </div>

          <div className="login-form-wrapper">
            <h2>Đăng nhập tài khoản GiveAway</h2>
            <p>hoặc đăng ký bằng địa chỉ email</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '🙈'}
                </span>
              </div>

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>

            <div className="login-footer">
              <p>Bạn chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right-section">
        <div className="image-container">
          <img
            src={registerBackground.src}
            alt="GiveAway Community"
            className="background-image"
          />
          <div className="image-overlay">
            <div className="overlay-content">
              <h1>Chào mừng bạn đến với GiveAway</h1>
              <h2>Hãy cùng chúng tôi tạo nên sự khác biệt!</h2>
              <a href="/register" className="overlay-button">
                Đăng ký ngay
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;