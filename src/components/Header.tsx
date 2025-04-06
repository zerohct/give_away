import React, { useState } from "react";
import Link from "next/link";
import appConfig from "../config/appConfig";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

const MainBar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push("/login");
  };

  // Helper function to get the user's full name
  const getFullName = () => {
    if (!user) return "Người dùng";
    const { firstName, lastName } = user;
    return `${firstName || ""} ${lastName || ""}`.trim() || "Người dùng";
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
                <NavItem href="/campaign-index" label="Dự án" compact={true} />
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
            {isAuthenticated ? (
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
                      {getFullName()}
                    </p>{" "}
                    {/* Hiển thị tên người dùng */}
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || "Không có email"}
                    </p>{" "}
                    {/* Hiển thị email */}
                  </div>
                  <Link
                    href="/user/profile"
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
                      Quản lý tài khoản
                    </Link>
                  )}
                  <Link
                    href="/donations"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                    role="menuitem"
                  >
                    Lịch sử ủng hộ
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                    role="menuitem"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex sm:space-x-2">
                <Link
                  href="/login"
                  className="py-2 px-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 whitespace-nowrap"
                  aria-label="Đăng nhập"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="py-2 px-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 whitespace-nowrap"
                  aria-label="Đăng ký"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Mở menu chính</span>
                {mobileMenuOpen ? (
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
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
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${mobileMenuOpen ? "block" : "hidden"} lg:hidden`}
        id="mobile-menu"
      >
        <div className="pt-2 pb-3 space-y-1">
          <MobileNavItem href="/" label="Trang chủ" />
          {appConfig.features.enableCampaignCreation && (
            <MobileNavItem href="/campaign" label="Dự án" />
          )}
          {appConfig.features.enableEventRegistration && (
            <MobileNavItem href="/events" label="Sự kiện" />
          )}
          {appConfig.features.enableVolunteerRegistration && (
            <MobileNavItem href="/volunteer" label="TNV" />
          )}
          {appConfig.features.enableBlogPosts && (
            <MobileNavItem href="/blog" label="Tin tức" />
          )}
          <MobileNavItem href="/about-us" label="Về chúng tôi" />
          {isAuthenticated ? (
            <>
              <div className="border-t border-gray-200 pt-2">
                <p className="px-3 py-2 text-sm font-medium text-gray-700">
                  Xin chào, {getFullName()}!
                </p>
                <p className="px-3 py-2 text-xs text-gray-500 truncate">
                  {user?.email || "Không có email"}
                </p>
              </div>
              <MobileNavItem href="/user/profile" label="Hồ sơ cá nhân" />
              {appConfig.features.enableDonorDashboard && (
                <MobileNavItem href="/dashboard" label="Quản lý tài khoản" />
              )}
              <MobileNavItem href="/donations" label="Lịch sử ủng hộ" />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors duration-200"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <MobileNavItem href="/login" label="Đăng nhập" />
              <MobileNavItem href="/register" label="Đăng ký" />
            </>
          )}
          {appConfig.features.enableDonations && (
            <MobileNavItem
              href="/donate"
              label="Ủng hộ ngay"
              highlight={true}
            />
          )}
        </div>
      </div>
    </header>
  );
};

// NavItem component for desktop
const NavItem: React.FC<{
  href: string;
  label: string;
  compact?: boolean;
  tooltip?: string;
}> = ({ href, label, compact = false, tooltip }) => {
  return (
    <li>
      <Link
        href={href}
        className={`${
          compact ? "px-2 py-1 text-sm" : "px-3 py-2 text-base"
        } font-medium text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200`}
        aria-label={label}
        title={tooltip}
      >
        {label}
      </Link>
    </li>
  );
};

// MobileNavItem component for mobile
const MobileNavItem: React.FC<{
  href: string;
  label: string;
  highlight?: boolean;
}> = ({ href, label, highlight = false }) => {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 text-base font-medium ${
        highlight
          ? "text-white bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
          : "text-gray-700 hover:text-indigo-700 hover:bg-indigo-50"
      } transition-colors duration-200`}
      aria-label={label}
    >
      {label}
    </Link>
  );
};

export default MainBar;
