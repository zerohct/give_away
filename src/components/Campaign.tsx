import React from "react";
import { useRouter } from "next/router";
import CampaignCardIndex from "./campaigns/client/CampaignCardIndex";
import { useCampaign } from "@/context/CampaignContext";
import { useEffect } from "react";
import LoadingSpinner from "./ui/LoadingSpinner";
import ErrorMessage from "./ui/ErrorMessage";

const Campaign: React.FC = () => {
  const router = useRouter();
  const { campaigns, loading, error, fetchCampaigns } = useCampaign();

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  if (loading) {
    return <LoadingSpinner className="my-8" />;
  }

  if (error) {
    return <ErrorMessage message={error} className="my-8" />;
  }

  // Only display the first 3 campaigns
  const displayedCampaigns = campaigns.slice(0, 3);

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-800 relative">
          <span className="relative z-10">Các hoạt động nổi bật</span>
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-400 rounded"></span>
        </h2>

        {displayedCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCampaigns.map((campaign) => (
              <CampaignCardIndex key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Hiện chưa có chiến dịch nào.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Campaign;
