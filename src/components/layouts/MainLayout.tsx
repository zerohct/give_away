import React from "react";

import Footer from "../Footer";
import MainBar from "../Header"; // MainBar trở thành thanh header

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MainBar />

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
