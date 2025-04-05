// components/CampaignList.tsx
import { Campaign } from "@/types/campaign";
import { CampaignCard } from "./CampaignCard";
import { useState } from "react";

interface CampaignListProps {
  campaigns: Campaign[];
  isLoading?: boolean;
  title?: string;
  emptyMessage?: string;
}

export const CampaignList = ({
  campaigns,
  isLoading = false,
  title = "Campaigns",
  emptyMessage = "No campaigns found",
}: CampaignListProps) => {
  const [filter, setFilter] = useState<string>("all");

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    if (filter === "all") return true;
    if (filter === "featured") return campaign.isFeatured;
    return campaign.category === filter;
  });

  // Get unique categories
  const categories = [
    "all",
    "featured",
    ...new Set(
      campaigns
        .map((campaign) => campaign.category)
        .filter((category): category is string => !!category)
    ),
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 animate-pulse h-80 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-2xl font-bold">{title}</h2>

        {/* Category Filter */}
        <div className="flex overflow-x-auto pb-2 mt-2 sm:mt-0 space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                filter === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};
