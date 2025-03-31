import React from "react";
import Link from "next/link";
import appConfig from "../config/appConfig";

const Footer: React.FC = () => {
  return (
    <footer className="bg-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Organization Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{appConfig.site.name}</h3>
            <p className="text-indigo-200 mb-4">{appConfig.site.description}</p>
            <p className="text-indigo-200">
              Email: {appConfig.site.contactEmail}
              <br />
              Phone: {appConfig.site.supportPhone}
              <br />
              {appConfig.site.legalInfo.registeredCharity && (
                <span className="inline-block mt-2 text-xs bg-indigo-800 px-2 py-1 rounded">
                  Tổ chức từ thiện đã đăng ký số{" "}
                  {appConfig.site.legalInfo.registrationNumber}
                </span>
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-indigo-200 hover:text-white transition duration-200"
                >
                  Trang chủ
                </Link>
              </li>
              {appConfig.features.enableBlogPosts && (
                <li>
                  <Link
                    href="/blog"
                    className="text-indigo-200 hover:text-white transition duration-200"
                  >
                    Tin tức
                  </Link>
                </li>
              )}
              {appConfig.features.enableCampaignCreation && (
                <li>
                  <Link
                    href="/campaigns"
                    className="text-indigo-200 hover:text-white transition duration-200"
                  >
                    Dự án
                  </Link>
                </li>
              )}
              {appConfig.features.enableEventRegistration && (
                <li>
                  <Link
                    href="/events"
                    className="text-indigo-200 hover:text-white transition duration-200"
                  >
                    Sự kiện
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/about-us"
                  className="text-indigo-200 hover:text-white transition duration-200"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-indigo-200 hover:text-white transition duration-200"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          {appConfig.features.enableNewsletter && (
            <div>
              <h3 className="text-xl font-bold mb-4">Đăng ký nhận tin</h3>
              <p className="text-indigo-200 mb-4">
                Đăng ký để nhận thông tin mới nhất về các dự án và hoạt động của
                chúng tôi.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="px-4 py-2 rounded-l-md w-full focus:outline-none text-gray-800"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-md transition duration-200"
                >
                  Đăng ký
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="border-t border-indigo-800 mt-8 pt-6 text-center text-indigo-300">
          <p>
            &copy; {new Date().getFullYear()} {appConfig.site.name}. All rights
            reserved.
          </p>

          {/* Social Media Links */}
          <div className="flex justify-center space-x-4 mt-4">
            <a
              href={appConfig.site.socialMedia.facebook}
              className="text-indigo-200 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              href={appConfig.site.socialMedia.twitter}
              className="text-indigo-200 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <a
              href={appConfig.site.socialMedia.instagram}
              className="text-indigo-200 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href={appConfig.site.socialMedia.youtube}
              className="text-indigo-200 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>
          </div>

          {/* Language Selector */}
          {appConfig.content.supportedLanguages.length > 1 && (
            <div className="mt-4">
              <select className="bg-indigo-800 text-white px-3 py-1 rounded text-sm">
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
