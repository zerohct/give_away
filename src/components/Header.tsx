import React, { useState } from "react";
import Link from "next/link";
import appConfig from "../config/appConfig";

// Add a simple mock for authentication state
// In a real application, this would come from your auth context/provider
const useAuth = () => {
  // For demo purposes only - replace with actual auth logic
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return { isLoggedIn, setIsLoggedIn };
};

const MainBar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo with modern styling */}
          <div className="flex-shrink-0">
            <Link href="/" aria-label={`${appConfig.site.name} - Trang chủ`}>
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-lg px-3 py-2 transform hover:scale-105 transition-all duration-300 shadow-lg">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  <span className="text-yellow-300">Zero</span> GiveAway
                </h1>
              </div>
            </Link>
          </div>

          {/* Main navigation - Desktop with improved styling and spacing */}
          <nav
            className="hidden lg:block mx-4 flex-grow"
            aria-label="Menu chính"
          >
            <ul className="flex justify-center space-x-1">
              <NavItem href="/" label="Trang chủ" compact={true} />

              {appConfig.features.enableCampaignCreation && (
                <NavItem href="/campaigns" label="Dự án" compact={true} />
              )}

              {appConfig.features.enableEventRegistration && (
                <NavItem href="/events" label="Sự kiện" compact={true} />
              )}

              {appConfig.features.enableVolunteerRegistration && (
                <NavItem
                  href="/volunteer"
                  label="TNV"
                  compact={true}
                  tooltip="Tình nguyện viên"
                />
              )}

              {appConfig.features.enableBlogPosts && (
                <NavItem href="/blog" label="Tin tức" compact={true} />
              )}

              <NavItem href="/about-us" label="Về chúng tôi" compact={true} />
            </ul>
          </nav>

          {/* User actions */}
          <div className="flex items-center space-x-3">
            {/* Donation button always visible */}
            {appConfig.features.enableDonations && (
              <div className="hidden sm:block">
                <Link
                  href="/donate"
                  className="py-2 px-3 bg-gradient-to-r from-pink-500 to-rose-600 text-center rounded-lg text-white font-medium hover:from-pink-600 hover:to-rose-700 transition-all duration-300 shadow-md transform hover:translate-y-[-2px] whitespace-nowrap"
                  aria-label="Ủng hộ dự án"
                >
                  Ủng hộ ngay
                </Link>
              </div>
            )}

            {/* Auth buttons or User profile */}
            {isLoggedIn ? (
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="user-menu-button"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    onClick={toggleUserMenu}
                  >
                    <span className="sr-only">Mở menu người dùng</span>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                {/* User dropdown menu */}
                <div
                  className={`${
                    userMenuOpen
                      ? "transform opacity-100 scale-100"
                      : "transform opacity-0 scale-95 pointer-events-none"
                  } transition ease-in-out duration-200 absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">
                      Xin chào!
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      user@example.com
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                    role="menuitem"
                  >
                    Hồ sơ cá nhân
                  </Link>

                  {appConfig.features.enableDonorDashboard && (
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                      role="menuitem"
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                        </svg>
                        Quản lý tài khoản
                      </div>
                    </Link>
                  )}

                  <Link
                    href="/donations"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                    role="menuitem"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                          clipRule="evenodd"
                        />
                        <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                      </svg>
                      Lịch sử ủng hộ
                    </div>
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <Link
                    href="/logout"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    role="menuitem"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Đăng xuất
                    </div>
                  </Link>
                </div>
              </div>
            ) : (
              /* Show login/register buttons when user is not logged in */
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/login"
                  className="py-2 px-3 text-indigo-600 hover:text-white hover:bg-indigo-600 font-medium transition-all duration-300 rounded-lg"
                  aria-label="Đăng nhập vào tài khoản"
                >
                  Đăng nhập
                </Link>

                <Link
                  href="/register"
                  className="py-2 px-3 text-white bg-indigo-600 hover:bg-indigo-700 font-medium transition-all duration-300 rounded-lg shadow-md"
                  aria-label="Đăng ký tài khoản mới"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 focus:outline-none transition duration-300"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Mở menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden ${
          mobileMenuOpen ? "block" : "hidden"
        } animate-fadeIn shadow-lg`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavItem href="/" label="Trang chủ" />

          {appConfig.features.enableCampaignCreation && (
            <MobileNavItem href="/campaigns" label="Dự án" />
          )}

          {appConfig.features.enableEventRegistration && (
            <MobileNavItem href="/events" label="Sự kiện" />
          )}

          {appConfig.features.enableVolunteerRegistration && (
            <MobileNavItem href="/volunteer" label="Tình nguyện viên" />
          )}

          {appConfig.features.enableBlogPosts && (
            <MobileNavItem href="/blog" label="Tin tức" />
          )}

          <MobileNavItem href="/about-us" label="Về chúng tôi" />

          {appConfig.features.enableDonations && (
            <MobileNavItem
              href="/donate"
              label="Ủng hộ ngay"
              isHighlighted={true}
            />
          )}
        </div>

        {/* Mobile auth section */}
        <div className="pt-3 pb-3 border-t border-gray-200">
          {isLoggedIn ? (
            <div className="px-4 py-2 space-y-2">
              <div className="flex items-center px-2 py-2">
                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Xin chào!</p>
                  <p className="text-xs text-gray-500 truncate">
                    user@example.com
                  </p>
                </div>
              </div>

              <Link
                href="/profile"
                className="block w-full py-2 px-4 text-left rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium transition duration-200"
              >
                Hồ sơ cá nhân
              </Link>

              {appConfig.features.enableDonorDashboard && (
                <Link
                  href="/dashboard"
                  className="block w-full py-2 px-4 text-left rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium transition duration-200"
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                    Quản lý tài khoản
                  </div>
                </Link>
              )}

              <Link
                href="/logout"
                className="block w-full py-2 px-4 text-left rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition duration-200"
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Đăng xuất
                </div>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 px-4 py-2">
              <Link
                href="/login"
                className="block text-center py-2 text-indigo-600 bg-indigo-50 rounded-lg font-medium hover:bg-indigo-100 transition duration-200"
                aria-label="Đăng nhập vào tài khoản"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="block text-center py-2 text-white bg-indigo-600 rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
                aria-label="Đăng ký tài khoản mới"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const NavItem = ({
  href,
  label,
  isHighlighted = false,
  compact = false,
  tooltip = "",
}: {
  href: string;
  label: string;
  isHighlighted?: boolean;
  compact?: boolean;
  tooltip?: string;
}) => {
  return (
    <li className="relative group">
      <Link
        href={href}
        className={`block py-2 px-3 rounded-lg transition-all duration-300 ${
          isHighlighted
            ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium hover:from-pink-600 hover:to-rose-700 shadow-sm transform hover:translate-y-[-2px]"
            : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
        } ${compact ? "text-sm whitespace-nowrap" : ""}`}
        aria-label={`Truy cập ${tooltip || label}`}
      >
        {label}
        {!isHighlighted && (
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
        )}
      </Link>
      {tooltip && (
        <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap z-10">
          {tooltip}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      )}
    </li>
  );
};

const MobileNavItem = ({
  href,
  label,
  isHighlighted = false,
}: {
  href: string;
  label: string;
  isHighlighted?: boolean;
}) => {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
        isHighlighted
          ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-sm"
          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
      }`}
      aria-label={`Truy cập ${label}`}
    >
      {label}
    </Link>
  );
};

// For demonstration only - replace with a button that toggles the auth state
const DemoLoginToggle = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  return (
    <button
      onClick={() => setIsLoggedIn(!isLoggedIn)}
      className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-lg text-xs z-50"
    >
      Toggle Login (Demo)
    </button>
  );
};

export default MainBar;
