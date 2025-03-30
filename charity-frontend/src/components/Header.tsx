import React from 'react';

import charityBanner from "../assets/images/q.png"; // Hình ảnh banner

const Header: React.FC = () => {
  return (
    <header className="header">
      {/* Phần Banner */}
      <section className="banner-section">
        <div className="banner-content">
          <h1>Chung tay vì một thế giới tốt đẹp hơn</h1>
          <p>Hãy cùng chúng tôi giúp đỡ những người có hoàn cảnh khó khăn và tạo ra sự thay đổi tích cực trong cộng đồng.</p>
          <a href="/donate" className="donate-button">Quyên góp ngay</a>
        </div>
        <img src={charityBanner.src} alt="Charity Banner" className="banner-image" />
      </section>

      <section className="about-section">
        <h2>Về chúng tôi</h2>
        <p>
          Chúng tôi là một tổ chức phi lợi nhuận với sứ mệnh hỗ trợ những người có hoàn cảnh khó khăn, cải thiện cuộc sống của họ và xây dựng một cộng đồng bền vững. Hãy cùng chúng tôi lan tỏa yêu thương và sự chia sẻ.
        </p>
      </section>
    </header>
  );
};

export default Header;