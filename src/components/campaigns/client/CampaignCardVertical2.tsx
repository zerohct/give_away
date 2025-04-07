import React, { useState } from "react";
import { Campaign } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils/format";
import {
  Calendar,
  MapPin,
  Users,
  Heart,
  Sparkles,
  Clock,
  Gift,
} from "lucide-react";

interface CampaignCardVertical2Props {
  campaign: Campaign;
}

const CampaignCardVertical2: React.FC<CampaignCardVertical2Props> = ({
  campaign,
}) => {
  const [isHovering, setIsHovering] = useState(false);

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

  const getPrimaryImage = () => {
    const primaryMedia = campaign.media?.find((m) => m.isPrimary);
    if (primaryMedia?.base64Image) return primaryMedia.base64Image;
    if (primaryMedia?.url) {
      if (
        primaryMedia.url.startsWith("http") ||
        primaryMedia.url.startsWith("/")
      )
        return primaryMedia.url;
      return `/${primaryMedia.url}`;
    }
    return "/images/default-campaign.jpg";
  };

  const mainImage = getPrimaryImage();
  const isBase64Image = mainImage.startsWith("data:");

  const getUserAvatar = () => {
    if (!campaign.createdBy?.avatar) return "/images/default-avatar.jpg";
    if (campaign.createdBy.avatar.startsWith("data:"))
      return campaign.createdBy.avatar;
    if (
      campaign.createdBy.avatar.startsWith("http") ||
      campaign.createdBy.avatar.startsWith("/")
    )
      return campaign.createdBy.avatar;
    return `/${campaign.createdBy.avatar}`;
  };

  const userAvatar = getUserAvatar();
  const donorCount = campaign.donationCount || 0;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-200";
      case "completed":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "urgent":
        return "bg-rose-500/10 text-rose-700 border-rose-200";
      case "pending":
        return "bg-amber-500/10 text-amber-700 border-amber-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Sparkles size={12} className="mr-1" />;
      case "completed":
        return <Gift size={12} className="mr-1" />;
      case "urgent":
        return <Clock size={12} className="mr-1" />;
      default:
        return null;
    }
  };

  const getUrgencyColor = () => {
    if (!daysLeft || daysLeft > 10) return "from-indigo-500 to-violet-600";
    if (daysLeft > 5) return "from-amber-500 to-orange-600";
    return "from-rose-500 to-red-600";
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-400 flex flex-col h-full border border-gray-100 relative"
      style={{ boxShadow: "0 6px 20px -8px rgba(0, 0, 0, 0.08)" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image container */}
      <div className="relative h-48 overflow-hidden group">
        {isBase64Image ? (
          <div
            className="w-full h-full bg-no-repeat bg-center bg-cover transition-transform duration-700 ease-out transform-gpu"
            style={{
              backgroundImage: `url(${mainImage})`,
              transform: isHovering ? "scale(1.08)" : "scale(1)",
            }}
          />
        ) : (
          <Image
            src={mainImage}
            alt={campaign.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out transform-gpu"
            style={{ transform: isHovering ? "scale(1.08)" : "scale(1)" }}
            width={400}
            height={192}
            priority={false}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-75 group-hover:opacity-85 transition-opacity duration-500"></div>

        {/* Category and status */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium shadow-sm border border-gray-100">
          {campaign.category || "Khác"}
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {campaign.isFeatured && (
            <span className="bg-yellow-400 text-gray-900 text-[10px] font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
              <Heart size={10} className="mr-1" />
              Nổi bật
            </span>
          )}
          <span
            className={`${getStatusColor(
              campaign.status
            )} text-[10px] font-medium px-2 py-1 rounded-full flex items-center border shadow-sm`}
          >
            {getStatusIcon(campaign.status)}
            {campaign.status}
          </span>
        </div>

        {/* Title and creator */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
          <h3 className="text-lg font-semibold text-white line-clamp-1 mb-1">
            <Link href={`/campaigns/${campaign.slug || campaign.id}`}>
              {campaign.title}
            </Link>
          </h3>
          <div className="flex items-center text-xs text-white/80">
            {campaign.createdBy && (
              <div className="flex items-center mr-3">
                <div className="w-5 h-5 rounded-full overflow-hidden mr-1 ring-1 ring-white/40">
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
            {campaign.location && (
              <div className="flex items-center">
                <MapPin size={10} className="mr-1 text-white/70" />
                <span>{campaign.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Description */}
        <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
          {campaign.description || "Không có mô tả cho chiến dịch này."}
        </p>

        {/* Progress and stats */}
        <div className="mt-auto space-y-3">
          {/* Progress bar */}
          <div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1 overflow-hidden">
              <div
                className={`bg-gradient-to-r ${getUrgencyColor()} h-1.5 rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-indigo-600">{progress}%</span>
              <span className="font-medium text-gray-700">
                {formatCurrency(campaign.collectedAmount)} /{" "}
                {formatCurrency(campaign.targetAmount)}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-[10px] text-gray-600">
            <div className="flex items-center">
              <Users size={12} className="mr-1 text-indigo-500" />
              <span>{donorCount} người ủng hộ</span>
            </div>
            {daysLeft !== null && (
              <div className="flex items-center">
                <Calendar size={12} className="mr-1 text-indigo-500" />
                <span>
                  {daysLeft > 0 ? `Còn ${daysLeft} ngày` : "Đã kết thúc"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="px-4 pb-4 pt-1">
        <Link
          href={`/campaigns/${campaign.slug || campaign.id}`}
          className={`block w-full bg-gradient-to-r ${getUrgencyColor()} hover:brightness-110 text-white text-center py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden group`}
        >
          <span className="relative z-10">Ủng hộ ngay</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
        </Link>
      </div>
    </div>
  );
};

export default CampaignCardVertical2;
