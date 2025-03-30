import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for password visibility toggle
import registerBackground from "../assets/images/q.png"; // Thay thế bằng đường dẫn hình ảnh thực tế của bạn
import logo from "../assets/images/GiveAway_logo.png";
import { toast } from 'react-toastify';
import { AuthService } from '../services/AuthService';  // Import AuthService to call API
import { useRouter } from 'next/router'; // Import useRouter để chuyển hướng

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Validate email format
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle registration form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation: Check if password and confirmPassword match
    if (password !== confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Email không hợp lệ.");
      return;
    }

    setIsLoading(true); // Show loading spinner

    try {
      // Call the registration API
      const response = await AuthService.register({ fullName, email, password });

      // Handle success
      if (response) {
        toast.success("Đăng ký thành công!");
        // Redirect to login page
        router.push('/login');
      }
    } catch (error: any) {
      // Handle error
      const errorMessage = error?.message || 'Đăng ký thất bại, vui lòng thử lại!';
      toast.error(errorMessage);
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="giveaway-register-container">
      <div className="register-left-section">
        <div className="register-content">
          <div className="register-logo" style={{ marginTop: '20px' }}>
            <img src={logo.src} alt="GiveAway Logo" />
          </div>

          <div className="register-form-wrapper">
            <h2>Đăng ký tài khoản GiveAway</h2>
            <p>hoặc đăng nhập nếu bạn đã có tài khoản</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  aria-label="Họ và tên"
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email"
                />
              </div>

              <div className="form-group password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Mật khẩu"
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="form-group">
                <input
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  aria-label="Xác nhận mật khẩu"
                />
              </div>

              <button type="submit" className="register-button" disabled={isLoading}>
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
            </form>

            <div className="register-footer">
              <p>Bạn đã có tài khoản? <a href="/login">Đăng nhập ngay</a></p>
            </div>
          </div>
        </div>
      </div>

      <div className="register-right-section">
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
              <a href="/login" className="overlay-button">
                Đăng nhập ngay
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;