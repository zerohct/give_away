import React from "react";
import { formatShortDate } from "@/lib/utils/dateFormatter";
import { Edit, Trash, User, Shield } from "lucide-react";
import Link from "next/link";
import UserStatusBadge from "./UserStatusBadge";

interface UserType {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  createdAt: string;
  roles: { name: string }[];
}

interface UserTableProps {
  users: UserType[];
  onDeleteClick: (id: number) => void;
}

export default function UserTable({
  users,
  onDeleteClick,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-purple-50 to-blue-50 text-gray-700">
            <th className="px-6 py-4 text-left">User</th>
            <th className="px-6 py-4 text-left">Email</th>
            <th className="px-6 py-4 text-center">Role</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Created</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed User';
            const mainRole = user.roles && user.roles.length > 0 ? user.roles[0].name : 'User';

            // Log to check if ids are unique
            console.log(user.id); // Check the id value

            // Ensure unique key by using index if id is not available
            return (
              <tr
                key={user.id || index} // Fallback to index if id is not available
                className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      {mainRole.toLowerCase() === 'admin' ? (
                        <Shield className="h-6 w-6 text-purple-500" />
                      ) : (
                        <User className="h-6 w-6 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-1">
                        {fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {user.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-700">{user.email}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {mainRole}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <UserStatusBadge status={user.status || 'active'} />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-sm text-gray-500">
                    {formatShortDate(user.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Link href={`/admin/users/${user.id}/edit`}>
                      <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                    </Link>
                    <button
                      className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors"
                      onClick={() => onDeleteClick(user.id)}
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
