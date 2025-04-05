// app/pages/admin/index.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Sửa: dùng useRouter từ next/navigation
import { useAuth } from "@/context/AuthContext"; // Cập nhật đường dẫn
import { toast } from "react-toastify";
import AdminLayout from "@/components/layouts/AdminLayout"; // Cập nhật đường dẫn
import Link from "next/link"; // Thêm Link để điều hướng

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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard Admin</h1>
        <p className="mb-4">
          Chào mừng bạn đến với trang quản trị. Tại đây, bạn có thể quản lý các
          chiến dịch, sự kiện, tình nguyện viên và các chức năng khác.
        </p>
        {/* Thêm nút điều hướng đến /admin/campaigns */}
        <Link href="/admin/campaigns">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Xem danh sách chiến dịch
          </button>
        </Link>
        {/* Thêm các component, bảng thống kê hoặc nội dung dashboard khác */}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
