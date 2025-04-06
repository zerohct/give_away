import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Loader, X, Mail, Phone, Lock, User, Shield, ChevronLeft } from "lucide-react";

interface FormErrors {
  [key: string]: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const { fetchUserById, updateUser, loading } = useUser();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "active",
    roleIds: [] as number[],
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const pathParts = path.split("/");
      const id = pathParts[pathParts.indexOf("users") + 1];
      if (id) {
        setUserId(id);
      } else {
        console.error("User ID could not be extracted from URL");
        router.push("/admin/users");
      }
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const pathParts = path.split("/");
      const id = pathParts[pathParts.indexOf("users") + 1];
      if (id) {
        setUserId(id);  // Cập nhật userId từ URL
      } else {
        console.error("User ID could not be extracted from URL");
        router.push("/admin/users");
      }
    }
  }, [router]);
  
  useEffect(() => {
    const loadUser = async () => {
      if (!userId) return;
  
      setIsLoading(true);
      try {
        const user = await fetchUserById(parseInt(userId));  // Gọi API để lấy thông tin người dùng
        if (user) {
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
            status: user.status || "active",
            roleIds: Array.isArray(user.roles) ? user.roles.map(role => role.id) : [], // Cập nhật roleIds
            password: "",  // Mật khẩu để trống
            confirmPassword: "",  // Mật khẩu xác nhận để trống
          });
        }
      } catch (error) {
        console.error("Failed to load user:", error);  // Nếu có lỗi
      } finally {
        setIsLoading(false);  // Hoàn tất tải dữ liệu
      }
    };
  
    loadUser();  // Gọi hàm loadUser để tải dữ liệu người dùng khi userId thay đổi
  }, [userId, fetchUserById]);  // Tái thực thi useEffect khi userId thay đổi
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      status: e.target.value,
    });
  };

  const addRole = (roleId: number) => {
    if (!formData.roleIds.includes(roleId)) {
      setFormData({
        ...formData,
        roleIds: [...formData.roleIds, roleId],
      });
    }
  };

  const removeRole = (roleId: number) => {
    setFormData({
      ...formData,
      roleIds: formData.roleIds.filter((id) => id !== roleId),
    });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName || formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName || formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;

      const updatedUser = await updateUser(parseInt(userId), userData);
      if (updatedUser) {
        router.push("/admin/users");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout activeId="users" title="Edit User">
        <div className="container mx-auto p-4 flex justify-center items-center h-64">
          <Loader className="animate-spin mr-2" />
          <span>Loading user data...</span>
        </div>
      </AdminLayout>
    );
  }

  const roleOptions = [
    { id: 1, name: "Admin", description: "Full system access and control" },
    { id: 2, name: "User", description: "Standard user access" },
    { id: 3, name: "Editor", description: "Can edit content but not settings" },
    { id: 4, name: "Viewer", description: "Read-only access to content" },
  ];

  return (
    <AdminLayout activeId="users" title="Edit User">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <button
            onClick={() => router.push("/admin/users")}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={20} />
            <span>Back to Users</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Edit User</h1>
            <p className="text-gray-500">Update the details of your system user</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className={`w-full p-2 border rounded-md ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className={`w-full p-2 border rounded-md ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>Email <span className="text-red-500">*</span></span>
                    </div>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    className={`w-full p-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      <span>Phone</span>
                    </div>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleStatusChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                  <p className="text-gray-500 text-xs">Active users can log in and use the system</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-1" />
                      <span>New Password</span>
                    </div>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter new password (leave blank to keep current)"
                    className={`w-full p-2 border rounded-md ${errors.password ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-1" />
                      <span>Confirm New Password</span>
                    </div>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    className={`w-full p-2 border rounded-md ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  <span>User Roles</span>
                </div>
              </label>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roleOptions.map((role) => (
                    <div
                      key={role.id}
                      className={`p-3 rounded-md border transition-colors ${
                        formData.roleIds.includes(role.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-800">{role.name}</div>
                          <div className="text-sm text-gray-500">{role.description}</div>
                        </div>
                        {formData.roleIds.includes(role.id) ? (
                          <button
                            type="button"
                            onClick={() => removeRole(role.id)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addRole(role.id)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Selected Roles:</div>
                  <div className="flex flex-wrap gap-2">
                    {formData.roleIds.length > 0 ? (
                      formData.roleIds.map((roleId) => {
                        const role = roleOptions.find(r => r.id === roleId);
                        return role ? (
                          <span
                            key={roleId}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            {role.name}
                            <button
                              type="button"
                              onClick={() => removeRole(roleId)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ) : null;
                      })
                    ) : (
                      <span className="text-gray-500 text-sm">No roles selected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push("/admin/users")}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-70 flex items-center"
              >
                {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Update User
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
