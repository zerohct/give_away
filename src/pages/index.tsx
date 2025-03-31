import React from "react";
import Campaign from "../components/Campaign";
import Banner from "../components/Banner"; // Header trở thành Banner

function Main() {
  return (
    <div className="space-y-12">
      <Banner />
      <Campaign />

      {/* Phần Tham gia cùng chúng tôi */}
      <section className="join-us-section bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">
          Tham gia cùng chúng tôi
        </h2>
        <p className="text-gray-700 mb-6">
          Bạn có thể tham gia vào các hoạt động từ thiện của chúng tôi bằng
          nhiều cách khác nhau: quyên góp, trở thành tình nguyện viên, hoặc chia
          sẻ thông tin về các chương trình của chúng tôi.
        </p>
        <div className="join-options flex flex-wrap gap-4">
          <a
            href="/donate"
            className="join-button bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition duration-200 shadow-md"
          >
            Quyên góp
          </a>
          <a
            href="/volunteer"
            className="join-button bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-3 px-6 rounded-lg font-medium transition duration-200 shadow-md"
          >
            Tình nguyện viên
          </a>
          <a
            href="/share"
            className="join-button bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition duration-200 shadow-md"
          >
            Chia sẻ
          </a>
        </div>
      </section>
    </div>
  );
}

export default Main;
