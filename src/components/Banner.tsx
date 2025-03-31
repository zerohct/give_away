import React from "react";
import Link from "next/link";
import Image from "next/image";
import appConfig from "../config/appConfig";
import charityBanner from "../assets/images/q.png";

const Navbar: React.FC = () => {
  return (
    <header className="w-full bg-white">
      {/* Hero Banner Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 leading-tight">
                {appConfig.site.name}
              </h1>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                {appConfig.site.description}
              </p>
              {appConfig.features.enableDonations && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/donate"
                    className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 text-center"
                  >
                    Quyên góp ngay
                  </Link>
                  <Link
                    href="/projects"
                    className="inline-block px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-md border border-indigo-200 hover:bg-indigo-50 transition duration-300 text-center"
                  >
                    Xem các dự án
                  </Link>
                </div>
              )}
            </div>
            <div className="w-full md:w-2/5 shadow-xl rounded-lg overflow-hidden transform hover:scale-105 transition duration-300">
              <Image
                src={charityBanner}
                alt="Charity Banner"
                className="w-full h-auto"
                placeholder="blur"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      {/* About Section */}
      <div className="bg-white border-t border-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
                Về chúng tôi
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Chúng tôi là một tổ chức phi lợi nhuận với sứ mệnh hỗ trợ những
                người có hoàn cảnh khó khăn, cải thiện cuộc sống của họ và xây
                dựng một cộng đồng bền vững. Hãy cùng chúng tôi lan tỏa yêu
                thương và sự chia sẻ.
              </p>
            </div>
            <div className="md:w-1/3 bg-indigo-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-indigo-700 mb-3">
                Liên hệ với chúng tôi
              </h3>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  {appConfig.site.contactEmail}
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                  {appConfig.site.supportPhone}
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  {appConfig.site.legalInfo.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
