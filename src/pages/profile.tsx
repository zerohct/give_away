import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { AuthService } from "../services/AuthService";
import Image from "next/image";
import Link from "next/link";

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Làm mới thông tin người dùng từ API
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const updatedProfile = await AuthService.getProfile();
        setProfileData(updatedProfile);
        setFormData({
          firstName: updatedProfile.firstName || "",
          lastName: updatedProfile.lastName || "",
          email: updatedProfile.email || "",
          phone: updatedProfile.phone || "",
        });
      } catch (error: any) {
        // Xử lý lỗi
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý upload ảnh
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Xử lý khi chọn file ảnh
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra kích thước file (giới hạn 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB.");
      return;
    }

    // Kiểm tra định dạng file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận định dạng JPG, PNG hoặc GIF.");
      return;
    }

    setLoading(true);
    try {
      // Tạo FormData để upload
      const formData = new FormData();
      formData.append('avatar', file);

      // Giả định có API để upload avatar
      // const response = await AuthService.uploadAvatar(formData);
      
      // Thay thế bằng cách tạo URL tạm thời cho preview
      const imageUrl = URL.createObjectURL(file);
      
      // Cập nhật profileData với URL ảnh mới
      setProfileData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          avatar: imageUrl,
          id: prev.id,
          email: prev.email,
          firstName: prev.firstName,
          lastName: prev.lastName,
          role: prev.role,
        };
      });

      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật ảnh đại diện");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý lưu thông tin
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gọi API để cập nhật thông tin
      // const updatedProfile = await AuthService.updateProfile(formData);
      
      // Giả định cập nhật thành công
      setProfileData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          ...formData,
          id: prev.id,
          role: prev.role
        };
      });

      setIsEditing(false);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Đang tải...</div>;
  }

  if (!profileData) {
    return <div className="flex min-h-screen items-center justify-center">Không tìm thấy thông tin người dùng.</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col items-center">
      {/* Header với avatar và tên */}
      <div className="w-full bg-white shadow-sm py-6 flex justify-center">
        <div className="max-w-4xl w-full px-4">
          <div className="flex flex-col items-center">
            {/* Avatar với chức năng upload */}
            <div className="relative mb-2">
              <div 
                className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={handleAvatarClick}
              >
                {(profileData as any).avatar ? (
                  <img
                    src={(profileData as any).avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                )}
                
                {/* Overlay khi hover */}
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-full">
                  <span className="text-white text-sm font-medium">Thay đổi ảnh</span>
                </div>
              </div>
              
              {/* Icon camera */}
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-200 cursor-pointer" onClick={handleAvatarClick}>
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              
              {/* Input file ẩn */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            
            {/* Tên người dùng */}
            <h1 className="text-xl font-semibold text-gray-800 mt-2">
              {profileData.firstName && profileData.lastName
                ? `${profileData.firstName} ${profileData.lastName}`
                : "Đào Truyền"}
            </h1>

            {/* Thống kê */}
            <div className="grid grid-cols-3 gap-6 w-full max-w-md mt-4 text-center">
              <div className="border-r border-gray-200">
                <p className="text-gray-500 text-sm">Dự án</p>
                <p className="font-semibold text-red-500">0</p>
              </div>
              <div className="border-r border-gray-200">
                <p className="text-gray-500 text-sm">Tổ chức</p>
                <p className="font-semibold text-red-500">0</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Số tiền ủng hộ</p>
                <p className="font-semibold text-red-500">0đ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phần nội dung chính */}
      <div className="max-w-4xl w-full px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Dự án đã ủng hộ</h2>
        
        {/* Thông báo chưa có dự án */}
        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
          <p className="text-gray-600 mb-6">
            Hiện tại bạn chưa ủng hộ cho dự án nào. Hãy khám phá các dự án của chúng tôi và tìm một dự án phù hợp để thực hiện điều đó nhé.
          </p>
          
          {/* Biểu tượng */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 relative">
              <svg className="w-full h-full text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div className="absolute bottom-0 right-0">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Nút khám phá */}
          <Link href="/projects">
            <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md uppercase text-sm tracking-wide transition duration-200">
              Khám phá dự án của chúng tôi
            </button>
          </Link>
        </div>
        
        {/* Thông tin cá nhân */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                Chỉnh sửa
              </button>
            )}
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md text-sm transition duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md text-sm transition duration-200"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-gray-600 w-32 mb-1 sm:mb-0">Họ và tên:</span>
                <span className="text-gray-800">
                  {profileData.firstName && profileData.lastName
                    ? `${profileData.lastName} ${profileData.firstName}`
                    : "Chưa cập nhật"}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-gray-600 w-32 mb-1 sm:mb-0">Email:</span>
                <span className="text-gray-800">{profileData.email || "Chưa cập nhật"}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-gray-600 w-32 mb-1 sm:mb-0">Số điện thoại:</span>
                <span className="text-gray-800">{profileData.phone || "Chưa cập nhật"}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;