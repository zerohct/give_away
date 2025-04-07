"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import AdminLayout from "@/components/layouts/AdminLayout";
import { UpdateUserData, User } from "@/types";
import {
  Loader,
  X,
  Mail,
  User as UserIcon,
  Phone,
  Shield,
  UserCheck,
} from "lucide-react";

interface FormErrors {
  [key: string]: string;
}

export default function EditUserPage() {
  const router = useRouter();
  // Extract user ID from the URL
  const [userId, setUserId] = useState<string>("");
  const { fetchUserById, updateUser, loading } = useUser();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("basic");

  // Form state
  const [formData, setFormData] = useState<UpdateUserData>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    roles: "USER",
  });

  // Avatar preview state
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Extract the user ID from the URL when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const pathParts = path.split("/");
      // Extract the ID from the URL path (e.g., /admin/users/3/edit)
      // The ID should be at index position before 'edit'
      const editIndex = pathParts.indexOf("edit");
      if (editIndex > 0) {
        const id = pathParts[editIndex - 1];
        if (id && !isNaN(Number(id))) {
          setUserId(id);
        } else {
          console.error(
            "User ID could not be extracted from URL or is not a valid number"
          );
          router.push("/admin/users");
        }
      } else {
        console.error("URL structure is not as expected");
        router.push("/admin/users");
      }
    }
  }, [router]);

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) {
        return; // Wait until userId is set
      }

      setIsLoading(true);
      try {
        const user = await fetchUserById(parseInt(userId));
        if (user) {
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
            roles: user.role ? user.role : "USER",
          });

          // Set avatar preview if available
          if (user.avatar) {
            setAvatarPreview(user.avatar);
          }
        } else {
          console.error("User not found");
          router.push("/admin/users");
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [userId, fetchUserById, router]);

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

    // Clear error for this field if exists
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      roles: value,
    });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName || formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName || formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
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
      const updatedUser = await updateUser(parseInt(userId), formData);

      if (updatedUser) {
        router.push("/admin/users");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Information", icon: UserIcon },
    { id: "access", label: "Access & Roles", icon: Shield },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-4 flex justify-center items-center h-64">
          <Loader className="animate-spin mr-2" />
          <span>Loading user data...</span>
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

              {/* Tabs Navigation */}
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
                {/* Tab 1: Basic Information */}
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
                              First Name <span className="text-red-500">*</span>
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
                              Last Name <span className="text-red-500">*</span>
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

                {/* Tab 2: Access & Roles */}
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
                          <span>Assigned Role</span>
                        </div>
                      </label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <select
                            name="role"
                            value={formData.roles}
                            onChange={handleRoleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition appearance-none"
                          >
                            <option value="user">User</option>
                            <option value="admin">Administrator</option>
                            <option value="EDITOR">Editor</option>
                            <option value="VIEWER">Viewer</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                              className="fill-current h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                          <h4 className="font-medium text-indigo-800 mb-2">
                            Role Description
                          </h4>
                          {formData.roles === "ADMIN" ? (
                            <p className="text-sm text-indigo-700">
                              Administrators have full access to all features
                              and can manage users, content, and system
                              settings.
                            </p>
                          ) : formData.roles === "EDITOR" ? (
                            <p className="text-sm text-indigo-700">
                              Editors can create and manage content but cannot
                              access system settings or user management.
                            </p>
                          ) : formData.roles === "VIEWER" ? (
                            <p className="text-sm text-indigo-700">
                              Viewers have read-only access to content and
                              cannot make changes or access administrative
                              features.
                            </p>
                          ) : (
                            <p className="text-sm text-indigo-700">
                              Standard users can access basic features but have
                              no administrative privileges.
                            </p>
                          )}
                        </div>
                      </div>
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
