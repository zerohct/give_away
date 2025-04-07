"use client";

import { FormEvent, useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Link as LinkIcon, Loader, UserPlus } from "lucide-react";
import Link from "next/link";

// Import components
import SearchBar from "@/components/Users/UserSearchBar";
import UserTable from "@/components/Users/UserTable";
import Pagination from "@/components/campaigns/admin/Pagination";
import DeleteConfirmDialog from "@/components/Users/DeleteUserConfirmDialog";

export default function UserListPage() {
  const { users, loading, error, fetchUsers, deleteUser } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const pageSize = 10;

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Local filtering based on search query
  const filteredUsers = users.filter((user) => {
    if (!searchQuery.trim()) return true;

    // Search in email, name, or any other relevant fields
    return (
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    // The filtering happens in the filteredUsers variable - no server call needed
  };

  const confirmDelete = (id: number) => {
    setUserToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete);
      setIsDeleteDialogOpen(false);
      // Refresh data after delete
      fetchUsers();
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AdminLayout activeId="users" title="User Management">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-500">Manage all system users</p>
          </div>
          <Link href="/admin/users/create">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </Link>
        </div>

        <div className="space-y-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="Search users..."
          />

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-16 flex flex-col items-center justify-center">
              <Loader className="animate-spin text-blue-500 h-8 w-8 mb-3" />
              <span className="text-gray-500 font-medium">
                Loading users...
              </span>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl shadow-sm p-16 flex flex-col items-center justify-center">
              <div className="text-red-500 mb-2">{/* Error icon */}</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Error Loading Users
              </h3>
              <p className="text-gray-500 mb-4 text-center">{error}</p>
              <button
                onClick={() => fetchUsers()}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : paginatedUsers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-16 flex flex-col items-center justify-center">
              <div className="text-gray-400 mb-2">{/* Empty state icon */}</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No Users Found
              </h3>
              <p className="text-gray-500 mb-4 text-center">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "No users available"}
              </p>
              <div className="flex gap-3">
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                  >
                    Clear Search
                  </button>
                )}
                <Link href="/admin/users/create">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add User
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <UserTable users={paginatedUsers} onDeleteClick={confirmDelete} />

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>

        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={handleDelete}
          userName={
            userToDelete
              ? users.find((u) => u.id === userToDelete)?.email || "this user"
              : "this user"
          }
        />
      </div>
    </AdminLayout>
  );
}
