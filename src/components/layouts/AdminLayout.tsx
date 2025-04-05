import React, { useState, useEffect } from "react";
import Sidebar from "../SideBar";
import Head from "next/head";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  activeId?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title = "Quản trị hệ thống",
  activeId = "dashboard",
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userHasToggled, setUserHasToggled] = useState(false);

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
    setUserHasToggled(true);
  };

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      if (isMobileView && !userHasToggled) {
        setSidebarCollapsed(true);
      } else if (!isMobileView && !userHasToggled) {
        setSidebarCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [userHasToggled]);

  return (
    <>
      <Head>
        <title>{title} | Từ Thiện - Vì cộng đồng</title>
      </Head>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          onToggle={handleSidebarToggle}
          collapsed={sidebarCollapsed}
          activeId={activeId}
        />

        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
        >
          <div className="sticky top-0 z-10 bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center">
                {isMobile && (
                  <button
                    onClick={() => handleSidebarToggle(!sidebarCollapsed)}
                    className="mr-3 p-2 rounded-full hover:bg-gray-100"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                )}
                <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
                  aria-label="Notifications"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    ></path>
                  </svg>
                </button>
                <button
                  className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
                  aria-label="Help"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="p-4">{children}</div>

          <footer className="px-4 py-3 mt-6 text-center text-sm text-gray-500 border-t">
            <p>
              © {new Date().getFullYear()} Từ Thiện - Vì cộng đồng. Phiên bản
              1.2.0
            </p>
          </footer>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
