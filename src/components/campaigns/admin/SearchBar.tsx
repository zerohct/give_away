import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
}: SearchBarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <form onSubmit={onSearch} className="flex gap-2">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search campaigns by title or description..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-gray-200 bg-gray-50 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Search
        </button>
      </form>
    </div>
  );
}
