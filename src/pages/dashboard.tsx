import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { AuthService } from "../services/AuthService";
import { ApiService } from "../services/ApiService";
import Link from "next/link";

interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, logout, checkAuth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UserUpdateData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Cập nhật formData khi user thay đổi
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "", // Không hiển thị mật khẩu hiện tại
      });
    }
  }, [user]);

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      logout();
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Đăng xuất thất bại");
    }
  };

  // Xử lý cập nhật thông tin tài khoản
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const updateData: UserUpdateData = {};

      // Chỉ gửi các trường đã thay đổi
      if (formData.firstName && formData.firstName !== user?.firstName) {
        updateData.firstName = formData.firstName;
      }
      if (formData.lastName && formData.lastName !== user?.lastName) {
        updateData.lastName = formData.lastName;
      }
      if (formData.email && formData.email !== user?.email) {
        updateData.email = formData.email;
      }
      if (formData.phone && formData.phone !== user?.phone) {
        updateData.phone = formData.phone;
      }
      if (formData.password) {
        updateData.password = formData.password;
      }

      if (Object.keys(updateData).length === 0) {
        toast.info("Không có thay đổi để cập nhật");
        setEditMode(false);
        return;
      }

      // Gọi API để cập nhật thông tin
      await ApiService.put("/users/update", updateData);
      toast.success("Cập nhật thông tin thành công!");

      // Làm mới thông tin người dùng
      await checkAuth();
      setEditMode(false);
    } catch (error: any) {
      toast.error(error.message || "Cập nhật thông tin thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa tài khoản
  const handleDelete = async () => {
    if (
      !confirm(
        "Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      // Gọi API để xóa tài khoản
      await ApiService.delete("/users/delete");
      toast.success("Xóa tài khoản thành công!");
      logout();
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Xóa tài khoản thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi giá trị form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Nếu đang tải dữ liệu, hiển thị loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Đang tải...
      </div>
    );
  }

  // Nếu không có dữ liệu người dùng, hiển thị thông báo
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Không tìm thấy thông tin người dùng.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between"></div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Chào mừng, {user.firstName} {user.lastName}!
          </h1>
          <p className="text-gray-600">
            Quản lý thông tin tài khoản của bạn tại đây.
          </p>
        </div>

        {/* Account Information Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Thông tin tài khoản
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Xem và chỉnh sửa thông tin cá nhân của bạn
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              {/* Họ và tên */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Họ và tên</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {editMode ? (
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Họ"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Tên"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span>
                        {user.firstName} {user.lastName || "Chưa cập nhật"}
                      </span>
                      <button
                        onClick={() => setEditMode(true)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Chỉnh sửa
                      </button>
                    </div>
                  )}
                </dd>
              </div>

              {/* Email */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Email"
                    />
                  ) : (
                    <div className="flex justify-between items-center">
                      <span>{user.email || "Chưa cập nhật"}</span>
                      <button
                        onClick={() => setEditMode(true)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Chỉnh sửa
                      </button>
                    </div>
                  )}
                </dd>
              </div>

              {/* Số điện thoại */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Số điện thoại
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {editMode ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Số điện thoại"
                    />
                  ) : (
                    <div className="flex justify-between items-center">
                      <span>{user.phone || "Chưa cập nhật"}</span>
                      <button
                        onClick={() => setEditMode(true)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Chỉnh sửa
                      </button>
                    </div>
                  )}
                </dd>
              </div>

              {/* Mật khẩu */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Mật khẩu</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {editMode ? (
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Mật khẩu mới (để trống nếu không đổi)"
                    />
                  ) : (
                    <div className="flex justify-between items-center">
                      <span>••••••••</span>
                      <button
                        onClick={() => setEditMode(true)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Đổi mật khẩu
                      </button>
                    </div>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Buttons: Save/Cancel/Delete */}
          {editMode && (
            <div className="px-4 py-5 sm:px-6 flex justify-end space-x-4">
              <button
                onClick={() => setEditMode(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdate}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Lưu thay đổi
              </button>
            </div>
          )}
          {!editMode && (
            <div className="px-4 py-5 sm:px-6 flex justify-end">
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Xóa tài khoản
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
