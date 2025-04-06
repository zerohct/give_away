import React from "react";
import { Campaign } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils/format";

interface CampaignCardHorizontalProps {
  campaign: Campaign;
}

const CampaignCardHorizontal: React.FC<CampaignCardHorizontalProps> = ({
  campaign,
}) => {
  const progress =
    campaign.collectedAmount && campaign.targetAmount
      ? Math.min(
          Math.round((campaign.collectedAmount / campaign.targetAmount) * 100),
          100
        )
      : 0;

  const daysLeft = campaign.deadline
    ? Math.max(
        0,
        Math.ceil(
          (new Date(campaign.deadline).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  const mainImage =
    campaign.media?.find((m) => m.isPrimary)?.url ||
    "/images/default-campaign.jpg";
  const user = campaign.createdBy;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row">
      <div className="relative md:w-1/3 h-48 md:h-auto">
        <Image
          src={mainImage}
          alt={campaign.title}
          className="w-full h-full object-cover"
          width={400}
          height={300}
          priority={false}
        />
        {campaign.emoji && (
          <span className="absolute top-3 left-3 text-2xl">
            {campaign.emoji}
          </span>
        )}
        {campaign.isFeatured && (
          <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Nổi bật
          </span>
        )}
      </div>

      <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-2">
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full mr-2">
              {campaign.category || "Chiến dịch"}
            </span>
            <span className="text-xs text-gray-500">{campaign.location}</span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            <Link
              href={`/campaigns/${campaign.id}`}
              className="hover:text-indigo-600"
            >
              {campaign.title}
            </Link>
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {campaign.description}
          </p>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold">
                {formatCurrency(campaign.collectedAmount || 0)}
              </span>
              <span className="text-gray-500">
                từ {formatCurrency(campaign.targetAmount)}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* <div className="flex items-center">
            <div className="mr-2 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <Image
                src={user?.avatar || "/images/default-avatar.png"}
                alt={user?.name || "Ẩn danh"}
                className="h-full w-full object-cover"
                width={32}
                height={32}
              />
            </div>
            <span className="text-sm text-gray-700">
              {user?.name || "Ẩn danh"}
            </span>
          </div> */}

          <div className="text-sm text-gray-500">
            {daysLeft > 0 ? `${daysLeft} ngày còn lại` : "Đã kết thúc"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCardHorizontal;
