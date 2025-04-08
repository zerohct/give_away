"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useRoles } from "@/context/RoleContext";
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
  Check,
  Plus,
  Tag,
} from "lucide-react";
import { CreateUserData } from "@/types";

interface FormErrors {
  [key: string]: string;
}

export default function CreateUserPage() {
  const router = useRouter();
  const { createUser, loading: userLoading } = useUser();
  const { roles, loading: rolesLoading, error: rolesError } = useRoles();
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [serverError, setServerError] = useState<string | null>(null);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Form state with default values
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

  // Clear form data on initial load
  useEffect(() => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      status: "active",
      roleIds: [],
    });
  }, []);

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

  // Add role to selection
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

  // Remove role from selection
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
    setServerError(null);

    if (!validate()) {
      if (errors.email) setActiveTab("basic");
      else if (errors.password || errors.confirmPassword)
        setActiveTab("security");
      else if (errors.roleIds) setActiveTab("roles");
      return;
    }

    try {
      const { confirmPassword, roleIds, ...userData } = formData;
      const roleNames = roleIds
        .map((id) => roles.find((role) => role.id === id)?.name || "")
        .filter(Boolean);
      const userPayload: CreateUserData = {
        user: {
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          phone: userData.phone || undefined,
        },
        roles: roleNames.join(","),
      };
      console.log(
        "Payload sent from client:",
        JSON.stringify(userPayload, null, 2)
      );
      const newUser = await createUser(userPayload);
      if (newUser) router.push("/admin/users");
    } catch (error: any) {
      console.error("Failed to create user:", error);
      const errorMessage =
        error.message || "Failed to create user. Please try again later.";
      setServerError(errorMessage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Information", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "roles", label: "Roles & Permissions", icon: Shield },
  ];

  return (
    <AdminLayout>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen pb-12">
        <div className="container mx-auto px-4 pt-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Create New User
                </h1>
                <p className="text-gray-600 mt-1">
                  Add a new user to the system with specific roles and
                  permissions
                </p>
              </div>
              <button
                onClick={() => router.push("/admin/users")}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Users
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {tabs.map((tab, index) => (
                  <div key={tab.id} className="flex-1 relative">
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center w-full ${
                        activeTab === tab.id
                          ? "text-blue-600"
                          : index < tabs.findIndex((t) => t.id === activeTab)
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-sm transition-all ${
                          activeTab === tab.id
                            ? "bg-blue-100 text-blue-600 ring-2 ring-blue-600 ring-offset-2 scale-110"
                            : index < tabs.findIndex((t) => t.id === activeTab)
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {index < tabs.findIndex((t) => t.id === activeTab) ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <tab.icon className="h-6 w-6" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>

                    {index < tabs.length - 1 && (
                      <div
                        className={`absolute top-6 left-1/2 w-full h-0.5 ${
                          index < tabs.findIndex((t) => t.id === activeTab)
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <div className="flex items-center">
                  <div className="p-3 bg-white/20 rounded-lg mr-4">
                    <UserPlus className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">User Registration</h2>
                    <p className="opacity-90 mt-1">
                      Complete the form to create a new user account
                    </p>
                  </div>
                </div>
              </div>

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
                          Please check your input or try again later. If the
                          problem persists, contact support.
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
                            First Name
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400">
                              <User className="h-5 w-5" />
                            </span>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="Enter first name"
                              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">
                            Last Name
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400">
                              <User className="h-5 w-5" />
                            </span>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Enter last name"
                              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
                            />
                          </div>
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
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-400">
                            <Mail className="h-5 w-5" />
                          </span>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="user@example.com"
                            className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition ${
                              errors.email
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
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
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-400">
                            <Phone className="h-5 w-5" />
                          </span>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
                          />
                        </div>
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
                            <span>
                              Password <span className="text-red-500">*</span>
                            </span>
                          </div>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-400">
                            <Lock className="h-5 w-5" />
                          </span>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter password"
                            className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition ${
                              errors.password
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
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
                            <span>
                              Confirm Password{" "}
                              <span className="text-red-500">*</span>
                            </span>
                          </div>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-400">
                            <Lock className="h-5 w-5" />
                          </span>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm password"
                            className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition ${
                              errors.confirmPassword
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
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
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-400">
                            <Settings className="h-5 w-5" />
                          </span>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleStatusChange}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition appearance-none bg-white pr-10"
                            style={{
                              backgroundImage:
                                "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                              backgroundPosition: "right 0.5rem center",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "1.5em 1.5em",
                            }}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">
                              Pending Verification
                            </option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                          Active users can log in and use the system immediately
                        </p>
                      </div>

                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mt-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-yellow-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              <strong>Note:</strong> A welcome email with
                              temporary password will be sent to the user's
                              email address if you select "Pending
                              Verification".
                            </p>
                          </div>
                        </div>
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
                        Assign roles to determine what the user can access and
                        modify
                      </p>
                    </div>

                    <div className="space-y-5">
                      {rolesLoading ? (
                        <div className="text-center p-10">
                          <Loader className="h-8 w-8 animate-spin text-green-600 mx-auto" />
                          <p className="text-gray-500 mt-4">
                            Loading available roles...
                          </p>
                        </div>
                      ) : rolesError ? (
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
                      ) : (
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 mr-1" />
                              <span>
                                Add Roles{" "}
                                <span className="text-red-500">*</span>
                              </span>
                            </div>
                          </label>

                          {/* Custom Role Selector */}
                          <div className="relative">
                            <div
                              className={`border ${
                                errors.roleIds
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-300"
                              } rounded-lg p-2 min-h-16 flex flex-wrap gap-2 cursor-pointer mb-2`}
                              onClick={() =>
                                setShowRoleDropdown(!showRoleDropdown)
                              }
                            >
                              {formData.roleIds.length > 0 ? (
                                formData.roleIds.map((roleId) => {
                                  const role = roles.find(
                                    (r) => r.id === roleId
                                  );
                                  return role ? (
                                    <div
                                      key={roleId}
                                      className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm flex items-center"
                                    >
                                      <Tag className="h-3 w-3 mr-1" />
                                      {role.name}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeRole(roleId);
                                        }}
                                        className="ml-1 hover:bg-green-200 rounded-full p-1"
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
                                          className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
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
                                              <Plus className="h-4 w-4 text-blue-600" />
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
                            <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                              <div className="flex items-center text-blue-700 mb-3">
                                <Shield className="h-5 w-5 mr-2" />
                                <span className="font-medium">
                                  Selected Role Permissions
                                </span>
                              </div>

                              <div className="space-y-3">
                                {formData.roleIds.map((roleId) => {
                                  const role = roles.find(
                                    (r) => r.id === roleId
                                  );
                                  return role ? (
                                    <div
                                      key={roleId}
                                      className="bg-white p-3 rounded border border-blue-100"
                                    >
                                      <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                          <Shield className="h-4 w-4 text-blue-600" />
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

                          <p className="text-gray-500 text-xs mt-4">
                            Users can have multiple roles. Each role comes with
                            specific permissions.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = tabs.findIndex(
                        (tab) => tab.id === activeTab
                      );
                      if (currentIndex > 0) {
                        setActiveTab(tabs[currentIndex - 1].id);
                      }
                    }}
                    className={`flex items-center px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition ${
                      activeTab === tabs[0].id ? "invisible" : ""
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>

                  {activeTab !== tabs[tabs.length - 1].id ? (
                    <button
                      type="button"
                      onClick={() => {
                        const currentIndex = tabs.findIndex(
                          (tab) => tab.id === activeTab
                        );
                        if (currentIndex < tabs.length - 1) {
                          setActiveTab(tabs[currentIndex + 1].id);
                        }
                      }}
                      className="flex items-center px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Continue
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={userLoading}
                      className="flex items-center px-5 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {userLoading ? (
                        <>
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Create User
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
