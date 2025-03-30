import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <h1>GiveAway</h1>
      </div>
      <ul className="nav-links">
        <li><a href="/">Trang chủ</a></li>
        <li><a href="#">Dự án</a></li>
        <li><a href="/AboutUs">Về chúng tôi</a></li>
        <li><a href="#">Hướng dẫn</a></li>
        <li><a href="#">Ủng hộ ngay</a></li>
        <li className="sidebar-auth">
          <a href="/login" className="auth-link">
            Đăng nhập
          </a>
          <span className="auth-separator">|</span>
          <a href="/register" className="auth-link">
            Đăng ký
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;