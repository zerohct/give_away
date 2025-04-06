import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import appConfig from "../config/appConfig";

interface SidebarItemProps {
  id: string;
  href: string;
  icon: React.ReactNode;
  text: string;
  activeId: string;
  collapsed: boolean;
}

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
  collapsed?: boolean;
  activeId?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  id,
  href,
  icon,
  text,
  activeId,
  collapsed,
}) => {
  const isActive = id === activeId;

  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-100 font-medium transform translate-x-1 border-l-4 border-teal-400"
          : "text-gray-100 hover:bg-white/10 hover:translate-x-1"
      }`}
    >
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full ${
          isActive ? "bg-teal-500 text-white" : "bg-white/10"
        } ${collapsed ? "mx-auto" : "mr-3"}`}
      >
        {icon}
      </div>
      {!collapsed && (
        <span className="transition-all duration-300">{text}</span>
      )}
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  onToggle,
  collapsed = false,
  activeId = "dashboard",
}) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [greeting, setGreeting] = useState("Xin chào");

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Chào buổi sáng");
    else if (hours < 18) setGreeting("Chào buổi chiều");
    else setGreeting("Chào buổi tối");
  }, []);

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-full flex flex-col bg-gradient-to-b from-teal-900 to-emerald-900 transition-all duration-300 rounded-r-2xl shadow-xl fixed z-20`}
    >
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-teal-500/20 blur-xl"></div>
      <div className="absolute bottom-20 -left-20 w-40 h-40 rounded-full bg-emerald-400/20 blur-xl"></div>

      <div className="p-3 flex items-center justify-between relative z-20">
        {!collapsed && (
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white">Từ Thiện</h1>
            <p className="text-xs text-emerald-300 opacity-75">Vì cộng đồng</p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="text-white hover:text-emerald-300 transition-colors p-2 rounded-full bg-white/5 hover:bg-white/10 z-20"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {collapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            )}
          </svg>
        </button>
      </div>

      {!collapsed && user && (
        <div className="px-3 py-2 relative z-20">
          <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </div>
              <div>
                <div className="text-xs text-emerald-300">{greeting}</div>
                <div className="font-medium text-white">
                  {user.firstName} {user.lastName}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-300 mt-1 flex items-center">
              <svg
                className="w-3 h-3 mr-1 text-emerald-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>
      )}

      {collapsed && user && (
        <div className="p-3 relative z-20">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </div>
        </div>
      )}

      <nav
        className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto relative z-20"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#059669 transparent",
        }}
      >
        <style jsx>{`
          nav::-webkit-scrollbar {
            width: 2mm;
          }
          nav::-webkit-scrollbar-track {
            background: transparent;
          }
          nav::-webkit-scrollbar-thumb {
            background-color: #059669;
            border-radius: 20px;
            border: 2px solid transparent;
          }
        `}</style>

        <SidebarItem
          id="dashboard"
          href="/admin"
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          }
          text="Trang chủ"
          activeId={activeId}
          collapsed={collapsed}
        />

        {/* Donation features */}
        {appConfig.features.enableDonations && (
          <SidebarItem
            id="donations"
            href="/donations"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            text="Ủng hộ"
            activeId={activeId}
            collapsed={collapsed}
          />
        )}

        {/* Campaign features */}
        {appConfig.features.enableCampaignCreation && (
          <SidebarItem
            id="campaigns"
            href="/admin/campaigns"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
            text="Chiến dịch"
            activeId={activeId}
            collapsed={collapsed}
          />
        )}

        {/* Blog features */}
        {appConfig.features.enableBlogPosts && (
          <SidebarItem
            id="blog"
            href="/blog"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            }
            text="Bài viết"
            activeId={activeId}
            collapsed={collapsed}
          />
        )}

        {/* Events features */}
        {appConfig.features.enableEventRegistration && (
          <SidebarItem
            id="events"
            href="/events"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
            text="Sự kiện"
            activeId={activeId}
            collapsed={collapsed}
          />
        )}

        {/* Volunteer features */}
        {appConfig.features.enableVolunteerRegistration && (
          <SidebarItem
            id="volunteer"
            href="/volunteer"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            text="Tình nguyện viên"
            activeId={activeId}
            collapsed={collapsed}
          />
        )}

        {/* Admin section */}
        {user && user.role === "admin" && (
          <>
            {!collapsed && (
              <div className="pt-3 pb-1">
                <div className="flex items-center px-3">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-grow"></div>
                  <p className="px-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                    Quản trị
                  </p>
                  <div className="h-px bg-gradient-to-r from-white/20 via-white/20 to-transparent flex-grow"></div>
                </div>
              </div>
            )}

            <SidebarItem
              id="admin-dashboard"
              href="/admin"
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
              text="Bảng điều khiển"
              activeId={activeId}
              collapsed={collapsed}
            />

            <SidebarItem
              id="admin-users"
              href="/admin/users"
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              }
              text="Người dùng"
              activeId={activeId}
              collapsed={collapsed}
            />
          </>
        )}
      </nav>

      <div className="p-3 mt-auto relative z-20">
        <div className={`${!collapsed ? "mb-2 px-2" : ""}`}>
          <div
            className={`flex items-center ${
              !collapsed
                ? "justify-between text-xs text-gray-400"
                : "justify-center"
            }`}
          >
            {!collapsed && (
              <>
                <div className="flex items-center">
                  <div className="h-1 w-1 rounded-full bg-emerald-400 mr-1"></div>
                  <span>Trực tuyến</span>
                </div>
                <span>v1.2.0</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={logout}
          className={`w-full flex ${
            collapsed ? "justify-center" : ""
          } items-center px-3 py-2 text-sm text-white rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-200 transition-colors`}
        >
          <svg
            className={`w-4 h-4 ${collapsed ? "" : "mr-3"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
