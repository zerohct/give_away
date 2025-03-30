import { useEffect, useState } from "react";
import { ApiService } from "../services/ApiService";
import { ENDPOINTS } from "../lib/constants/apiEndpoints";
import MainLayout from "../components/layouts/MainLayout";
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Campaign from '../components/Campaign'; // Import component Campaign
import charityBanner from "../assets/images/q.png"; // Hình ảnh banner

function Main() {
  return (
    <main className="main-container">
      <Sidebar />
      {/* Phần Header */}
      <div>
        <Header />
      </div>

      {/* Phần Các hoạt động nổi bật */}
      <Campaign />
      <section className="activities-section">
        
      </section>

      {/* Phần Tham gia cùng chúng tôi */}
      <section className="join-us-section">
        <h2>Tham gia cùng chúng tôi</h2>
        <p>
          Bạn có thể tham gia vào các hoạt động từ thiện của chúng tôi bằng nhiều cách khác nhau: quyên góp, trở thành tình nguyện viên, hoặc chia sẻ thông tin về các chương trình của chúng tôi.
        </p>
        <div className="join-options">
          <a href="/donate" className="join-button">Quyên góp</a>
          <a href="/volunteer" className="join-button">Tình nguyện viên</a>
          <a href="/share" className="join-button">Chia sẻ</a>
        </div>
      </section>
    </main>
  );
}

export default Main;