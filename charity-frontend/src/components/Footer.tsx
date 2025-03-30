import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { IconContext } from 'react-icons'; // Import IconContext
import appConfig from "../config/appConfig";  // Import cấu hình appConfig

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Phần thông tin liên hệ */}
        <div className="footer-section">
          <h3>Liên hệ</h3>
          <p>Địa chỉ: {appConfig.site.legalInfo.address}</p> {/* Lấy địa chỉ từ cấu hình */}
          <p>Email: {appConfig.site.contactEmail}</p> {/* Lấy email từ cấu hình */}
          <p>Điện thoại: {appConfig.site.supportPhone}</p> {/* Lấy số điện thoại từ cấu hình */}
        </div>

        {/* Phần liên kết nhanh */}
        <div className="footer-section">
          <h3>Liên kết nhanh</h3>
          <ul>
            <li><a href="/">{appConfig.site.name}</a></li> {/* Lấy tên website từ cấu hình */}
            <li><a href="/about">Về chúng tôi</a></li>
            <li><a href="/campaigns">Chiến dịch</a></li>
            <li><a href="/donate">Quyên góp</a></li>
            <li><a href="/contact">Liên hệ</a></li>
          </ul>
        </div>

        {/* Phần mạng xã hội */}
        <div className="footer-section">
          <h3>Theo dõi chúng tôi</h3>
          <IconContext.Provider value={{ className: 'icon', size: '24px' }}>
            <div className="social-icons">
              <a href={appConfig.site.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href={appConfig.site.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href={appConfig.site.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href={appConfig.site.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
            </div>
          </IconContext.Provider>
        </div>
      </div>

      {/* Phần đăng ký nhận tin */}
      <div className="footer-section">
        <h3>Đăng ký nhận tin</h3>
        <p>Nhận thông tin mới nhất từ chúng tôi qua email.</p>
        <form className="newsletter-form">
          <input type="email" placeholder="Nhập email của bạn" required />
          <button type="submit">Đăng ký</button>
        </form>
      </div>

      {/* Phần bản quyền */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {appConfig.site.name}. Tất cả quyền được bảo lưu.</p> {/* Lấy tên quỹ từ cấu hình */}
      </div>
    </footer>
  );
};

export default Footer;
