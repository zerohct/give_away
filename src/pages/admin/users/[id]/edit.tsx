// EditUserPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useRoles } from "@/context/RoleContext";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
  Loader,
  X,
  Mail,
  User as UserIcon,
  Phone,
  Shield,
  UserCheck,
  Tag,
  ChevronRight,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { UpdateUserData } from "@/types";

interface FormErrors {
  [key: string]: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const { fetchUserById, updateUser, loading } = useUser();
  const { roles, loading: rolesLoading, error: rolesError } = useRoles();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [serverError, setServerError] = useState<string | null>(null);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    roleIds: [] as number[],
  });

  // Avatar preview state
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Extract user ID from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const pathParts = path.split("/");
      const editIndex = pathParts.indexOf("edit");
      if (editIndex > 0) {
        const id = pathParts[editIndex - 1];
        if (id && !isNaN(Number(id))) {
          setUserId(id);
        } else {
          console.error("Invalid user ID in URL");
          router.push("/admin/users");
        }
      } else {
        console.error("Unexpected URL structure");
        router.push("/admin/users");
      }
    }
  }, [router]);

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      if (!userId || rolesLoading || rolesError) return;

      setIsLoading(true);
      try {
        const user = await fetchUserById(parseInt(userId));
        if (user) {
          // Giả sử API trả về danh sách roleIds hoặc roles dưới dạng mảng
          const userRoleIds = user.role
            ? (Array.isArray(user.role) ? user.role : user.role.split(","))
                .map((role: string | number) => {
                  // Nếu roles là mảng tên, tìm ID tương ứng trong danh sách roles
                  if (typeof role === "string") {
                    const matchedRole = roles.find(
                      (r) => r.name.toLowerCase() === role.toLowerCase()
                    );
                    return matchedRole ? matchedRole.id : null;
                  }
                  // Nếu roles đã là mảng ID
                  return role;
                })
                .filter((id: number | null) => id !== null)
            : [];

          setFormData({
            email: user.email || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phone: user.phone || "",
            password: "",
            roleIds: userRoleIds as number[],
          });
          if (user.profileImage) {
            setAvatarPreview(user.profileImage);
          }
        } else {
          console.error("User not found");
          router.push("/admin/users");
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        setServerError("Failed to load user data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [userId, fetchUserById, roles, rolesLoading, rolesError, router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    if (serverError) setServerError(null);
  };

  const addRole = (roleId: number) => {
    if (!formData.roleIds.includes(roleId)) {
      setFormData({
        ...formData,
        roleIds: [...formData.roleIds, roleId],
      });
    }
    if (errors.roleIds) {
      const newErrors = { ...errors };
      delete newErrors.roleIds;
      setErrors(newErrors);
    }
    setShowRoleDropdown(false);
  };

  const removeRole = (roleId: number) => {
    setFormData({
      ...formData,
      roleIds: formData.roleIds.filter((id) => id !== roleId),
    });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (formData.roleIds.length === 0) {
      newErrors.roleIds = "Please select at least one role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      if (errors.email) setActiveTab("basic");
      else if (errors.roleIds) setActiveTab("access");
      return;
    }

    try {
      const roleNames = formData.roleIds
        .map((id) => roles.find((role) => role.id === id)?.name || "")
        .filter(Boolean);

      const updateData: UpdateUserData = {
        email: formData.email,
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        phone: formData.phone || undefined,
        password: formData.password || undefined,
        roles: roleNames.join(","),
      };

      console.log("Payload sent to server:", updateData);

      const updatedUser = await updateUser(parseInt(userId), updateData);

      if (updatedUser) {
        router.push("/admin/users");
      }
    } catch (error: any) {
      console.error("Failed to update user:", error);
      const errorMessage =
        error.message || "Failed to update user. Please try again.";
      setServerError(errorMessage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Information", icon: UserIcon },
    { id: "access", label: "Access & Roles", icon: Shield },
  ];

  if (isLoading || rolesLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-4 flex justify-center items-center h-64">
          <Loader className="animate-spin mr-2" />
          <span>Loading user data...</span>
        </div>
      </AdminLayout>
    );
  }

  if (rolesError) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-4">
          <div className="bg-red-50 p-4 rounded-lg text-red-700 text-sm flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Failed to load roles</p>
              <p className="mt-1">{rolesError}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-2 text-red-600 hover:text-red-800 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen pb-12">
        <div className="container mx-auto px-4 pt-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <h1 className="text-3xl font-bold">Edit User</h1>
                <p className="opacity-90 mt-2">
                  Update user information and permissions
                </p>
              </div>

              {serverError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <X className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error
                      </h3>
                      <p className="text-sm text-red-700">{serverError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-6 transition-colors ${
                      activeTab === tab.id
                        ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                        : "text-gray-500 hover:text-blue-500"
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-2" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={onSubmit} className="p-6">
                <div className={activeTab === "basic" ? "block" : "hidden"}>
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-500">
                      <h2 className="text-xl font-semibold text-blue-700 mb-2">
                        User Information
                      </h2>
                      <p className="text-blue-600 text-sm">
                        Update the user's personal details
                      </p>
                    </div>

                    <div className="flex items-start mb-6">
                      <div className="mr-6">
                        <div className="w-24 h-24 relative rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="Avatar Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <UserIcon size={36} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                            <label
                              htmlFor="avatar-upload"
                              className="cursor-pointer w-full h-full flex items-center justify-center"
                            >
                              <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                        <p className="text-xs text-center mt-2 text-gray-500">
                          Click to update
                        </p>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="Enter first name"
                              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition ${
                                errors.firstName
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {errors.firstName && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.firstName}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Enter last name"
                              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition ${
                                errors.lastName
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {errors.lastName && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.lastName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              <span>
                                Email Address{" "}
                                <span className="text-red-500">*</span>
                              </span>
                            </div>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="email@example.com"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition ${
                              errors.email
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              <span>Phone Number</span>
                            </div>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleInputChange}
                            placeholder="+1234567890"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition ${
                              errors.phone
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
                      <h3 className="font-medium text-yellow-800 flex items-center">
                        <UserCheck className="h-5 w-5 mr-2" />
                        Reset Password (Optional)
                      </h3>
                      <p className="text-yellow-700 text-sm mb-3">
                        Leave blank to keep the current password
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password || ""}
                            onChange={handleInputChange}
                            placeholder="Enter new password"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 transition"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={activeTab === "access" ? "block" : "hidden"}>
                  <div className="space-y-6">
                    <div className="bg-indigo-50 rounded-lg p-5 border-l-4 border-indigo-500">
                      <h2 className="text-xl font-semibold text-indigo-700 mb-2">
                        User Roles & Permissions
                      </h2>
                      <p className="text-indigo-600 text-sm">
                        Manage user access and system permissions
                      </p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                      <label className="block text-sm font-medium mb-3 text-gray-700">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 mr-2" />
                          <span>
                            Assigned Roles{" "}
                            <span className="text-red-500">*</span>
                          </span>
                        </div>
                      </label>

                      <div className="relative">
                        <div
                          className={`border ${
                            errors.roleIds
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300"
                          } rounded-lg p-2 min-h-16 flex flex-wrap gap-2 cursor-pointer mb-2`}
                          onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                        >
                          {formData.roleIds.length > 0 ? (
                            formData.roleIds.map((roleId) => {
                              const role = roles.find((r) => r.id === roleId);
                              return role ? (
                                <div
                                  key={roleId}
                                  className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full text-sm flex items-center"
                                >
                                  <Tag className="h-3 w-3 mr-1" />
                                  {role.name}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeRole(roleId);
                                    }}
                                    className="ml-1 hover:bg-indigo-200 rounded-full p-1"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : null;
                            })
                          ) : (
                            <div className="text-gray-500 p-2 flex items-center">
                              <Plus className="h-4 w-4 mr-1" />
                              Click to add roles
                            </div>
                          )}

                          <div className="absolute right-3 top-4 text-gray-400">
                            <ChevronRight
                              className={`h-5 w-5 transition-transform ${
                                showRoleDropdown ? "rotate-90" : ""
                              }`}
                            />
                          </div>
                        </div>

                        {errors.roleIds && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {errors.roleIds}
                          </p>
                        )}

                        {showRoleDropdown && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-72 overflow-y-auto">
                            <div className="p-2 text-xs text-gray-500 bg-gray-50 border-b">
                              Select roles to assign to this user
                            </div>
                            {roles.length === 0 ? (
                              <div className="p-4 text-center text-gray-600">
                                No roles available
                              </div>
                            ) : (
                              <div>
                                {roles
                                  .filter(
                                    (role) =>
                                      !formData.roleIds.includes(role.id)
                                  )
                                  .map((role) => (
                                    <div
                                      key={role.id}
                                      onClick={() => addRole(role.id)}
                                      className="p-3 hover:bg-indigo-50 cursor-pointer border-b last:border-b-0 transition-colors"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="font-medium text-gray-800">
                                            {role.name}
                                          </p>
                                          {role.description && (
                                            <p className="text-sm text-gray-500 mt-0.5">
                                              {role.description}
                                            </p>
                                          )}
                                        </div>
                                        <div className="h-6 w-6 rounded-full border border-gray-300 flex items-center justify-center">
                                          <Plus className="h-4 w-4 text-indigo-600" />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {formData.roleIds.length > 0 && (
                        <div className="mt-4 bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                          <div className="flex items-center text-indigo-700 mb-3">
                            <Shield className="h-5 w-5 mr-2" />
                            <span className="font-medium">
                              Selected Role Permissions
                            </span>
                          </div>
                          <div className="space-y-3">
                            {formData.roleIds.map((roleId) => {
                              const role = roles.find((r) => r.id === roleId);
                              return role ? (
                                <div
                                  key={roleId}
                                  className="bg-white p-3 rounded border border-indigo-100"
                                >
                                  <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                      <Shield className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium">
                                        {role.name}
                                      </h4>
                                      <p className="text-sm text-gray-500">
                                        {role.description ||
                                          "No description available"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => router.push("/admin/users")}
                      className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>

                    <div className="flex gap-3">
                      {activeTab !== "basic" && (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveTab(
                              tabs[
                                tabs.findIndex((t) => t.id === activeTab) - 1
                              ].id
                            )
                          }
                          className="px-5 py-2.5 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          Previous
                        </button>
                      )}

                      {activeTab !== "access" ? (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveTab(
                              tabs[
                                tabs.findIndex((t) => t.id === activeTab) + 1
                              ].id
                            )
                          }
                          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Continue
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-70 flex items-center gap-2 shadow-md"
                        >
                          {loading && (
                            <Loader className="h-4 w-4 animate-spin" />
                          )}
                          Update User
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
