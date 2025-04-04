import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { ApiService } from "../../services/ApiService";
import AdminLayout from "../../components/layouts/AdminLayout";

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, logout, checkAuth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Đang tải...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Không tìm thấy thông tin người dùng.
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Dashboard Admin</h1>
        <p className="mb-4">
          Chào mừng bạn đến với trang quản trị. Tại đây, bạn có thể quản lý các
          chiến dịch, sự kiện, tình nguyện viên và các chức năng khác.
        </p>
        {/* Thêm các component, bảng thống kê hoặc nội dung dashboard khác */}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
