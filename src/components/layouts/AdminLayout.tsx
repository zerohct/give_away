import React, { useState, useEffect } from "react";
import CharitySidebar from "../SideBar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Create a function that will be passed to the sidebar component
  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex min-h-screen">
      <CharitySidebar onToggle={handleSidebarToggle} />
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "pl-20" : "pl-64"
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
