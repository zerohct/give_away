import React from "react";
import { Campaign } from "@/types"; // Import Campaign type
import CampaignCardHorizontal from "./CampaignCardHorizontal";
import CampaignCalendar from "./CampaignCalendar";

interface CampaignDisplaySectionProps {
  campaign: Campaign | null;
}

const CampaignDisplaySection: React.FC<CampaignDisplaySectionProps> = ({
  campaign,
}) => {
  if (!campaign) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Campaign Card - Takes 2/3 of the width on large screens */}
        <div className="w-full lg:w-2/3">
          <CampaignCardHorizontal
            campaign={campaign}
            onClick={() => {}}
            showFullDescription={true}
          />
        </div>

        {/* Calendar Section - Takes 1/3 of the width on large screens */}
        <div className="w-full lg:w-1/3">
          <CampaignCalendar campaign={campaign} />
        </div>
      </div>
    </div>
  );
};

export default CampaignDisplaySection;
