"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Loader, Plus, RefreshCw, Download, Upload, Filter, UserPlus } from "lucide-react";
import CampaignHeader from "@/components/campaigns/Users/UserHeader";
import SearchBar from "@/components/campaigns/Users/UserSearchBar";
import UserTable from "@/components/campaigns/Users/UserTable";
import Pagination from "@/components/campaigns/Users/UserPagination";
import DeleteConfirmDialog from "@/components/campaigns/Users/DeleteUserConfirmDialog";

export default function UserListPage() {
  const { users, loading, error, fetchUsers, deleteUser, searchUsers } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const pageSize = 10;

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchUsers(searchQuery);
    } else {
      fetchUsers();
    }
    setCurrentPage(1);
  };

  const confirmDelete = (id: number) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
      setUserToDelete({ id, name: userName });
      setIsDeleteDialogOpen(true);
    }
  };

  const handleDelete = async () => {
    if (userToDelete) {
      const success = await deleteUser(userToDelete.id);
      if (success) {
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
        fetchUsers();
      }
    }
  };

  // Filter users based on status if needed
  const filteredUsers = filterStatus === "all" 
    ? users 
    : users.filter(user => user.status === filterStatus);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const currentUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AdminLayout activeId="users" title="User Management">
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header with Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-500 mt-1">Manage and monitor all users in the system</p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                <a href="/admin/users/create">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New User
                  </button>
                </a>
                <button className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-lg p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-lg p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'Active').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-yellow-100 rounded-lg p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">Pending Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'pending').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-red-100 rounded-lg p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-red-600 font-medium">Inactive Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'inactive').length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                  placeholder="Search users by name, email or role..."
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <select 
                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <Filter className="h-4 w-4" />
                  </div>
                </div>
                
                <button 
                  onClick={() => fetchUsers()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* User Table Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center">
                <Loader className="animate-spin text-blue-500 h-8 w-8 mb-3" />
                <span className="text-gray-500 font-medium">Loading users...</span>
              </div>
            ) : error ? (
              <div className="p-16 flex flex-col items-center justify-center">
                <div className="text-red-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Error Loading Users</h3>
                <p className="text-gray-500 mb-4 text-center">{error}</p>
                <button
                  onClick={() => fetchUsers()}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center">
                <div className="text-gray-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Users Found</h3>
                <p className="text-gray-500 mb-4 text-center">
                  {searchQuery ? `No results found for "${searchQuery}"` : "No users available in the system"}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterStatus("all");
                      fetchUsers();
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                  <a href="/admin/users/create">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </button>
                  </a>
                </div>
              </div>
            ) : (
              <>
                <UserTable users={currentUsers} onDeleteClick={confirmDelete} />

                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(currentPage * pageSize, filteredUsers.length)}
                      </span>{" "}
                      of <span className="font-medium">{filteredUsers.length}</span> users
                    </p>
                    
                    {totalPages > 1 && (
                      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDelete}
        userName={userToDelete?.name || ''}
      />
    </AdminLayout>
  );
}