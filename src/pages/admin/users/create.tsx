"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
  Loader,
  X,
  Mail,
  Phone,
  User,
  Shield,
  Lock,
  UserPlus,
  Settings,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface FormErrors {
  [key: string]: string;
}

export default function CreateUserPage() {
  const router = useRouter();
  const { createUser, loading } = useUser();
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [serverError, setServerError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    status: "active",
    roleIds: [] as number[],
  });

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
    
    // Clear server error when user makes changes
    if (serverError) {
      setServerError(null);
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

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (formData.roleIds.length === 0) {
      newErrors.roleIds = "Please select at least one role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setServerError(null);
  
    if (!validate()) {
      // Nếu validation thất bại, chuyển sang tab có lỗi đầu tiên
      if (errors.firstName || errors.lastName || errors.email) {
        setActiveTab("basic");
      } else if (errors.password || errors.confirmPassword) {
        setActiveTab("security");
      } else if (errors.roleIds) {
        setActiveTab("roles");
      }
      return;
    }
  
    try {
      // Cập nhật dữ liệu người dùng theo đúng cấu trúc mà API yêu cầu
      const { confirmPassword, ...userData } = formData;
  
      // Prepare user data according to CreateUserDTO interface
      const userPayload = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        roles: userData.roleIds.map((id) => roleOptions.find((role) => role.id === id)?.name || ''), // Convert roleIds to role names
      };
  
      // Tạo người dùng thông qua hàm `createUser`
      const newUser = await createUser(userPayload);
      if (newUser) {
        router.push("/admin/users");
      }
    } catch (error: any) {
      console.error("Failed to create user:", error);
      setServerError(error.message || "Failed to create user. Please try again later.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setFormSubmitted(false);
    }
  };
  
  const tabs = [
    { id: "basic", label: "Basic Information", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "roles", label: "Roles & Permissions", icon: Shield },
  ];

  const roleOptions = [
    { id: 1, name: "Admin", description: "Full system access and control" },
    { id: 2, name: "User", description: "Standard user access" },
    { id: 3, name: "Editor", description: "Can edit content but not settings" },
    { id: 4, name: "Viewer", description: "Read-only access to content" },
  ];

  return (
    <AdminLayout>
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen pb-12">
        <div className="container mx-auto px-4 pt-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                {tabs.map((tab, index) => (
                  <div key={tab.id} className="flex-1 relative">
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center w-full ${
                        activeTab === tab.id
                          ? "text-blue-600"
                          : index < tabs.findIndex(t => t.id === activeTab)
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          activeTab === tab.id
                            ? "bg-blue-100 text-blue-600 ring-2 ring-blue-600 ring-offset-2"
                            : index < tabs.findIndex(t => t.id === activeTab)
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {index < tabs.findIndex(t => t.id === activeTab) ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <tab.icon className="h-5 w-5" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                    
                    {index < tabs.length - 1 && (
                      <div 
                        className={`absolute top-5 left-1/2 w-full h-0.5 ${
                          index < tabs.findIndex(t => t.id === activeTab)
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h1 className="text-3xl font-bold">Create New User</h1>
                <p className="opacity-90 mt-2">
                  Add a new user to the system with specific roles and permissions
                </p>
              </div>

              {/* Server Error Alert */}
              {serverError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error creating user
                      </h3>
                      <div className="mt-1 text-sm text-red-700">
                        <p>{serverError}</p>
                        <p className="mt-2 text-xs">
                          Please check your input or try again later. If the problem persists, contact support.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={onSubmit} className="p-6">
                {/* Tab 1: Basic Information */}
                <div className={activeTab === "basic" ? "block" : "hidden"}>
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-500">
                      <h2 className="text-xl font-semibold text-blue-700 mb-2">
                        User Information
                      </h2>
                      <p className="text-blue-600 text-sm">
                        Enter the basic details for the new user
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                              errors.firstName ? "border-red-500 bg-red-50" : "border-gray-300"
                            }`}
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" />
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
                              errors.lastName ? "border-red-500 bg-red-50" : "border-gray-300"
                            }`}
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            <span>Email Address <span className="text-red-500">*</span></span>
                          </div>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="user@example.com"
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition ${
                            errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                          }`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
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
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab 2: Security */}
                <div className={activeTab === "security" ? "block" : "hidden"}>
                  <div className="space-y-6">
                    <div className="bg-purple-50 rounded-lg p-5 border-l-4 border-purple-500">
                      <h2 className="text-xl font-semibold text-purple-700 mb-2">
                        Security Settings
                      </h2>
                      <p className="text-purple-600 text-sm">
                        Set up the user's password and account status
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          <div className="flex items-center">
                            <Lock className="h-4 w-4 mr-1" />
                            <span>Password <span className="text-red-500">*</span></span>
                          </div>
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter password"
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition ${
                            errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
                          }`}
                        />
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {errors.password}
                          </p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                          Password must be at least 6 characters long
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          <div className="flex items-center">
                            <Lock className="h-4 w-4 mr-1" />
                            <span>Confirm Password <span className="text-red-500">*</span></span>
                          </div>
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm password"
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition ${
                            errors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-300"
                          }`}
                        />
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          <div className="flex items-center">
                            <Settings className="h-4 w-4 mr-1" />
                            <span>Account Status</span>
                          </div>
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleStatusChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition appearance-none bg-white"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending Verification</option>
                          <option value="suspended">Suspended</option>
                        </select>
                        <p className="text-gray-500 text-xs mt-1">
                          Active users can log in and use the system immediately
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab 3: Roles & Permissions */}
                <div className={activeTab === "roles" ? "block" : "hidden"}>
                  <div className="space-y-6">
                    <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
                      <h2 className="text-xl font-semibold text-green-700 mb-2">
                        Roles & Permissions
                      </h2>
                      <p className="text-green-600 text-sm">
                        Assign roles to determine what the user can access and modify
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-1 gap-3">
                        {roleOptions.map((role) => (
                          <div
                            key={role.id}
                            className={`border rounded-lg p-4 transition-colors ${
                              formData.roleIds.includes(role.id)
                                ? "border-green-300 bg-green-50"
                                : "border-gray-200 hover:border-green-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-800">
                                  {role.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {role.description}
                                </div>
                              </div>
                              {formData.roleIds.includes(role.id) ? (
                                <button
                                  type="button"
                                  onClick={() => removeRole(role.id)}
                                  className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
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

                      <div className={`bg-blue-50 rounded-lg p-4 border ${errors.roleIds ? "border-red-300" : "border-blue-200"}`}>
                        <div className="flex items-center text-blue-700 mb-2">
                          <Shield className="h-5 w-5 mr-2" />
                          <span className="font-medium">Selected Roles</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.roleIds.length > 0 ? (
                            formData.roleIds.map((roleId) => {
                              const role = roleOptions.find((r) => r.id === roleId);
                              return role ? (
                                <span
                                  key={roleId}
                                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                >
                                  {role.name}
                                </span>
                              ) : null;
                            })
                          ) : (
                            <span className="text-gray-500 text-sm">No roles selected</span>
                          )}
                        </div>
                        {errors.roleIds && (
                          <p className="text-red-500 text-sm mt-2 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {errors.roleIds}
                          </p>
                        )}
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
                          className="px-5 py-2.5 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
                        >
                          <ChevronLeft size={16} className="mr-1" />
                          Previous
                        </button>
                      )}

                      {activeTab !== "roles" ? (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveTab(
                              tabs[
                                tabs.findIndex((t) => t.id === activeTab) + 1
                              ].id
                            )
                          }
                          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          Continue
                          <ChevronRight size={16} className="ml-1" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={loading || formSubmitted}
                          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-70 flex items-center gap-2 shadow-md"
                        >
                          {loading || formSubmitted ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <UserPlus size={18} className="mr-1" />
                          )}
                          {loading || formSubmitted ? "Creating..." : "Create User"}
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