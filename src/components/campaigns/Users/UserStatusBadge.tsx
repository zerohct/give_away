interface UserStatusBadgeProps {
    status: string;
  }
  
  export default function UserStatusBadge({
    status,
  }: UserStatusBadgeProps) {
    const getStatusStyles = () => {
      switch (status.toLowerCase()) {
        case "active":
          return "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200";
        case "pending":
          return "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200";
        case "inactive":
          return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200";
        case "suspended":
          return "bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200";
        default:
          return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200";
      }
    };
  
    return (
      <span
        className={`px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider ${getStatusStyles()}`}
      >
        {status}
      </span>
    );
  }