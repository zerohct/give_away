import { Plus } from "lucide-react";
import Link from "next/link";

export default function UserHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          User Management
        </h1>
        <p className="text-gray-500 mt-1">
          Manage user accounts and permissions
        </p>
      </div>
      <Link href="/admin/users/create">
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={18} />
          Add User
        </button>
      </Link>
    </div>
  );
}