import React from "react";
import { Campaign } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils/format";
import { Calendar, MapPin, Users, Heart } from "lucide-react";

interface CampaignCardVerticalProps {
  campaign: Campaign;
}

const CampaignCardVertical: React.FC<CampaignCardVerticalProps> = ({
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
    : null;

  // Get the main image - prioritize base64 images
  const getPrimaryImage = () => {
    const primaryMedia = campaign.media?.find((m) => m.isPrimary);

    if (primaryMedia?.base64Image) {
      return primaryMedia.base64Image;
    }

    // Fallback to URL if no base64 is available
    if (primaryMedia?.url) {
      if (
        primaryMedia.url.startsWith("http") ||
        primaryMedia.url.startsWith("/")
      ) {
        return primaryMedia.url;
      }
      return `/${primaryMedia.url}`;
    }

    return "/images/default-campaign.jpg";
  };

  const mainImage = getPrimaryImage();
  const isBase64Image = mainImage.startsWith("data:");

  // Get user avatar
  const getUserAvatar = () => {
    if (!campaign.createdBy?.avatar) return "/images/default-avatar.jpg";
    if (campaign.createdBy.avatar.startsWith("data:"))
      return campaign.createdBy.avatar;
    if (
      campaign.createdBy.avatar.startsWith("http") ||
      campaign.createdBy.avatar.startsWith("/")
    ) {
      return campaign.createdBy.avatar;
    }
    return `/${campaign.createdBy.avatar}`;
  };

  const userAvatar = getUserAvatar();

  // Calculate donation details
  const donorCount = campaign.donationCount || 0;
  const averageDonation =
    donorCount > 0 ? campaign.collectedAmount / donorCount : 0;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full border border-gray-100">
      {/* Image container with overlay elements */}
      <div className="relative h-56 overflow-hidden group">
        {isBase64Image ? (
          // Render base64 image
          <div
            className="w-full h-full bg-no-repeat bg-center bg-cover transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${mainImage})` }}
          />
        ) : (
          // Render regular image with Next.js Image component
          <Image
            src={mainImage}
            alt={campaign.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            width={400}
            height={224}
            priority={false}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>

        {/* Category pill */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
          {campaign.category || "Khác"}
        </div>

        {/* Status and featured badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          {campaign.isFeatured && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
              <Heart size={12} className="mr-1" />
              Nổi bật
            </span>
          )}

          <span
            className={`${getStatusColor(
              campaign.status
            )} text-xs font-medium px-3 py-1 rounded-full`}
          >
            {campaign.status}
          </span>
        </div>

        {/* Emoji display */}
        {campaign.emoji && (
          <span className="absolute left-3 bottom-3 text-3xl filter drop-shadow-md">
            {campaign.emoji}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-700 transition-colors">
          <Link href={`/campaigns/${campaign.slug || campaign.id}`}>
            {campaign.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {campaign.description || "Không có mô tả cho chiến dịch này."}
        </p>

        {/* Meta information */}
        <div className="mt-auto space-y-4">
          {/* Location and creator */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            {campaign.location && (
              <div className="flex items-center">
                <MapPin size={14} className="mr-1" />
                <span>{campaign.location}</span>
              </div>
            )}

            {campaign.createdBy && (
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full overflow-hidden mr-1">
                  {userAvatar.startsWith("data:") ? (
                    <div
                      className="w-full h-full bg-no-repeat bg-center bg-cover"
                      style={{ backgroundImage: `url(${userAvatar})` }}
                    />
                  ) : (
                    <Image
                      src={userAvatar}
                      alt={campaign.createdBy.firstName || ""}
                      width={20}
                      height={20}
                    />
                  )}
                </div>
                <span>{campaign.createdBy.firstName || "Ẩn danh"}</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-indigo-700">{progress}%</span>
              <span className="font-medium text-gray-700">
                {formatCurrency(campaign.collectedAmount)} /{" "}
                {formatCurrency(campaign.targetAmount)}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-4 text-gray-600">
            <div className="flex items-center">
              <Users size={14} className="mr-1 text-indigo-500" />
              <span>{donorCount} người ủng hộ</span>
            </div>

            {daysLeft !== null && (
              <div className="flex items-center">
                <Calendar size={14} className="mr-1 text-indigo-500" />
                <span>
                  {daysLeft > 0 ? `Còn ${daysLeft} ngày` : "Đã kết thúc"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-5 pb-5 pt-2">
        <Link
          href={`/campaigns/${campaign.slug || campaign.id}`}
          className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2.5 px-4 rounded-lg font-medium transition-colors"
        >
          Ủng hộ ngay
        </Link>
      </div>
    </div>
  );
};

export default CampaignCardVertical;
