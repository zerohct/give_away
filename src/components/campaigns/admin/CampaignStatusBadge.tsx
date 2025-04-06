interface CampaignStatusBadgeProps {
  status: string;
}

export default function CampaignStatusBadge({
  status,
}: CampaignStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200";
      case "pending":
        return "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200";
      case "completed":
        return "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200";
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

// Removed SearchBar component from this file to resolve duplicate export issue.
