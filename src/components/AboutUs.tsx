import React from "react";
import appConfig from "@/config/appConfig";
import Head from "next/head";
import Link from "next/link";

const AboutUs = () => {
  // Sử dụng dữ liệu từ appConfig
  const { site, features } = appConfig;

  return (
    <>
      <Head>
        <title>Về Chúng Tôi | {site.name}</title>
        <meta name="description" content={site.description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-green-700 text-white">
          <div
            className="absolute inset-0 bg-black opacity-50"
            style={{
              backgroundImage: "url('/images/hero-background.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              mixBlendMode: "overlay",
            }}
          ></div>
          <div className="container mx-auto px-4 py-24 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              Về Chúng Tôi
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-center">
              {site.description}
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
              Sứ Mệnh Của Chúng Tôi
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold text-green-600 mb-4">
                  Lan Tỏa Yêu Thương - Xây Dựng Cộng Đồng
                </h3>
                <p className="text-gray-700 mb-4">
                  {site.name} ra đời với niềm tin mãnh liệt rằng mỗi hành động
                  nhỏ đều có thể tạo nên sự thay đổi lớn. Chúng tôi làm việc
                  không ngừng nghỉ để kết nối những tấm lòng hảo tâm với những
                  hoàn cảnh khó khăn, xây dựng cầu nối yêu thương và sự sẻ chia
                  trong cộng đồng.
                </p>
                <p className="text-gray-700 mb-4">
                  Với slogan "{site.description}", chúng tôi tin rằng mỗi đóng
                  góp không chỉ giúp đỡ người nhận mà còn mang lại niềm vui và ý
                  nghĩa cho người cho.
                </p>
                <p className="text-gray-700">
                  Tại {site.name}, chúng tôi cam kết tạo ra một hệ sinh thái từ
                  thiện minh bạch, hiệu quả và bền vững, nơi mỗi đồng tiền quyên
                  góp đều được sử dụng một cách có trách nhiệm và tạo ra tác
                  động thực sự.
                </p>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/images/mission-image.jpg"
                  alt="Sứ mệnh của chúng tôi"
                  className="rounded-lg shadow-xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
              Giá Trị Cốt Lõi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-300 hover:-translate-y-2">
                <div className="text-4xl text-green-600 mb-4">❤️</div>
                <h3 className="text-xl font-semibold mb-2">Tình Thương</h3>
                <p className="text-gray-600">
                  Chúng tôi tin rằng tình thương là nền tảng của mọi hành động
                  từ thiện. Mỗi dự án của chúng tôi đều xuất phát từ trái tim và
                  hướng đến việc lan tỏa tình yêu thương trong cộng đồng.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-300 hover:-translate-y-2">
                <div className="text-4xl text-green-600 mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Minh Bạch</h3>
                <p className="text-gray-600">
                  Chúng tôi cam kết sự minh bạch tuyệt đối trong mọi hoạt động.
                  Mỗi đồng tiền quyên góp đều được theo dõi và báo cáo chi tiết
                  đến người ủng hộ.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-300 hover:-translate-y-2">
                <div className="text-4xl text-green-600 mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-2">Bền Vững</h3>
                <p className="text-gray-600">
                  Chúng tôi không chỉ giải quyết các vấn đề trước mắt mà còn
                  hướng đến các giải pháp dài hạn, tạo ra những thay đổi bền
                  vững cho cộng đồng.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-300 hover:-translate-y-2">
                <div className="text-4xl text-green-600 mb-4">🌱</div>
                <h3 className="text-xl font-semibold mb-2">Trao Quyền</h3>
                <p className="text-gray-600">
                  Chúng tôi tin vào việc trao quyền cho các cá nhân và cộng
                  đồng, giúp họ phát triển kỹ năng và nguồn lực để tự xây dựng
                  tương lai tốt đẹp hơn.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
              Hoạt Động Của Chúng Tôi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.enableDonations && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <div className="bg-green-100 text-green-700 p-3 rounded-full w-16 h-16 flex items-center justify-center text-2xl mb-4">
                    💰
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Quyên Góp</h3>
                  <p className="text-gray-600">
                    Chúng tôi kết nối những tấm lòng hảo tâm với các dự án từ
                    thiện có ý nghĩa,
                    {features.enableRecurringDonations &&
                      " hỗ trợ cả đóng góp một lần và đóng góp định kỳ "}
                    để tạo ra tác động lâu dài.
                  </p>
                </div>
              )}
              {features.enableCampaignCreation && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <div className="bg-green-100 text-green-700 p-3 rounded-full w-16 h-16 flex items-center justify-center text-2xl mb-4">
                    📣
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Chiến Dịch Từ Thiện
                  </h3>
                  <p className="text-gray-600">
                    Chúng tôi tổ chức và hỗ trợ các chiến dịch từ thiện đáp ứng
                    nhu cầu cấp thiết của các cộng đồng khó khăn trên khắp Việt
                    Nam.
                  </p>
                </div>
              )}
              {features.enableVolunteerRegistration && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <div className="bg-green-100 text-green-700 p-3 rounded-full w-16 h-16 flex items-center justify-center text-2xl mb-4">
                    👥
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Tình Nguyện Viên
                  </h3>
                  <p className="text-gray-600">
                    Chúng tôi tạo cơ hội cho mọi người tham gia các hoạt động
                    tình nguyện, đóng góp thời gian và kỹ năng để giúp đỡ cộng
                    đồng.
                  </p>
                </div>
              )}
              {features.enableBlogPosts && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <div className="bg-green-100 text-green-700 p-3 rounded-full w-16 h-16 flex items-center justify-center text-2xl mb-4">
                    📝
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Chia Sẻ Câu Chuyện
                  </h3>
                  <p className="text-gray-600">
                    Chúng tôi kể lại những câu chuyện truyền cảm hứng từ những
                    người nhận hỗ trợ và các tình nguyện viên để truyền cảm hứng
                    cho người khác.
                  </p>
                </div>
              )}
              {features.enableEventRegistration && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <div className="bg-green-100 text-green-700 p-3 rounded-full w-16 h-16 flex items-center justify-center text-2xl mb-4">
                    🎪
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Sự Kiện Cộng Đồng
                  </h3>
                  <p className="text-gray-600">
                    Chúng tôi tổ chức các sự kiện kết nối cộng đồng, nâng cao
                    nhận thức và gây quỹ cho các dự án từ thiện.
                  </p>
                </div>
              )}
              {features.enableImpactStats && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <div className="bg-green-100 text-green-700 p-3 rounded-full w-16 h-16 flex items-center justify-center text-2xl mb-4">
                    📊
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Báo Cáo Tác Động
                  </h3>
                  <p className="text-gray-600">
                    Chúng tôi theo dõi và chia sẻ tác động của mỗi đồng đóng
                    góp, đảm bảo sự minh bạch và trách nhiệm giải trình.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Legal Info Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
              Thông Tin Pháp Lý
            </h2>
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Tên Tổ Chức
                  </h3>
                  <p className="text-gray-600">{site.name}</p>
                </div>
                {site.legalInfo?.registrationNumber && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Số Đăng Ký
                    </h3>
                    <p className="text-gray-600">
                      {site.legalInfo.registrationNumber}
                    </p>
                  </div>
                )}
                {site.legalInfo?.taxId && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Mã Số Thuế
                    </h3>
                    <p className="text-gray-600">{site.legalInfo.taxId}</p>
                  </div>
                )}
                {site.legalInfo?.registeredCharity && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Trạng Thái
                    </h3>
                    <p className="text-gray-600">Tổ chức từ thiện đã đăng ký</p>
                  </div>
                )}
                {site.legalInfo?.address && (
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Địa Chỉ
                    </h3>
                    <p className="text-gray-600">{site.legalInfo.address}</p>
                  </div>
                )}
                {site.contactEmail && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Email Liên Hệ
                    </h3>
                    <p className="text-gray-600">{site.contactEmail}</p>
                  </div>
                )}
                {site.supportPhone && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Điện Thoại Hỗ Trợ
                    </h3>
                    <p className="text-gray-600">{site.supportPhone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="py-16 bg-green-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Cùng Chúng Tôi Lan Tỏa Yêu Thương
            </h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Dù là quyên góp, tình nguyện hay hợp tác, mỗi hành động của bạn
              đều có thể tạo nên sự khác biệt. Hãy liên hệ với chúng tôi ngay
              hôm nay!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/donate"
                className="bg-white text-green-700 px-6 py-3 rounded-full font-semibold hover:bg-green-100 transition duration-300"
              >
                Quyên Góp Ngay
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-green-700 transition duration-300"
              >
                Liên Hệ Với Chúng Tôi
              </Link>
            </div>
          </div>
        </section>

        {/* Footer Component would go here */}
      </div>
    </>
  );
};

export default AboutUs;
