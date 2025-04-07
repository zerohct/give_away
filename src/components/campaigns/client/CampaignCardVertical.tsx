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
  Share2,
  Eye,
} from "lucide-react";

interface CampaignCardVerticalProps {
  campaign: Campaign;
}

const CampaignCardVertical: React.FC<CampaignCardVerticalProps> = ({
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
        return "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-700 border-emerald-200";
      case "completed":
        return "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 border-blue-200";
      case "urgent":
        return "bg-gradient-to-r from-rose-500/20 to-rose-600/20 text-rose-700 border-rose-200";
      case "pending":
        return "bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-700 border-amber-200";
      default:
        return "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Sparkles size={14} className="mr-1.5" />;
      case "completed":
        return <Gift size={14} className="mr-1.5" />;
      case "urgent":
        return <Clock size={14} className="mr-1.5" />;
      default:
        return null;
    }
  };

  // Calculate urgency level for color styling
  const getUrgencyColor = () => {
    if (!daysLeft || daysLeft > 10) return "from-indigo-500 to-violet-600";
    if (daysLeft > 5) return "from-amber-500 to-orange-600";
    return "from-rose-500 to-red-600";
  };

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-gray-100 relative"
      style={{
        boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.1)",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Decorative Corner Elements */}
      <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden z-10">
        <div className="absolute transform rotate-45 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 w-40 h-6 -top-10 -left-10"></div>
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden z-10">
        <div className="absolute transform -rotate-45 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 w-40 h-6 -top-10 -right-10"></div>
      </div>

      {/* Image container with overlay elements */}
      <div className="relative h-72 overflow-hidden group">
        {isBase64Image ? (
          // Render base64 image
          <div
            className="w-full h-full bg-no-repeat bg-center bg-cover transition-transform duration-1000 ease-out transform-gpu"
            style={{
              backgroundImage: `url(${mainImage})`,
              transform: isHovering ? "scale(1.12)" : "scale(1)",
            }}
          />
        ) : (
          // Render regular image with Next.js Image component
          <Image
            src={mainImage}
            alt={campaign.title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out transform-gpu"
            style={{
              transform: isHovering ? "scale(1.12)" : "scale(1)",
            }}
            width={500}
            height={300}
            priority={false}
          />
        )}

        {/* Advanced gradient overlay with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-transparent mix-blend-overlay"></div>

        {/* Subtle Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)",
            backgroundSize: "100px 100px",
          }}
        ></div>

        {/* Action buttons on hover */}
        <div
          className={`absolute right-4 top-20 flex flex-col gap-3 transition-all duration-300 transform ${
            isHovering ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white transition-all duration-300 shadow-lg">
            <Eye size={18} />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white transition-all duration-300 shadow-lg">
            <Share2 size={18} />
          </button>
        </div>

        {/* Category chip with enhanced design */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold shadow-md flex items-center space-x-1.5 border border-gray-100">
          <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
          <span>{campaign.category || "Khác"}</span>
        </div>

        {/* Status and featured badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          {campaign.isFeatured && (
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center shadow-md backdrop-blur-sm border border-yellow-300/30">
              <Heart size={14} className="mr-1.5" />
              Nổi bật
            </span>
          )}

          <span
            className={`${getStatusColor(
              campaign.status
            )} text-xs font-semibold px-4 py-2 rounded-full flex items-center border shadow-md backdrop-blur-sm`}
          >
            {getStatusIcon(campaign.status)}
            {campaign.status}
          </span>
        </div>

        {/* Campaign title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-xl font-bold text-white line-clamp-1 mb-1">
            <Link href={`/campaigns/${campaign.slug || campaign.id}`}>
              {campaign.title}
            </Link>
          </h3>
          <div className="flex items-center text-xs text-white/80">
            {campaign.createdBy && (
              <div className="flex items-center mr-4">
                <div className="w-6 h-6 rounded-full overflow-hidden mr-2 ring-2 ring-white/50">
                  {userAvatar.startsWith("data:") ? (
                    <div
                      className="w-full h-full bg-no-repeat bg-center bg-cover"
                      style={{ backgroundImage: `url(${userAvatar})` }}
                    />
                  ) : (
                    <Image
                      src={userAvatar}
                      alt={campaign.createdBy.firstName || ""}
                      width={24}
                      height={24}
                    />
                  )}
                </div>
                <span>{campaign.createdBy.firstName || "Ẩn danh"}</span>
              </div>
            )}
            {campaign.location && (
              <div className="flex items-center">
                <MapPin size={12} className="mr-1 text-white/70" />
                <span>{campaign.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content with enhanced styling */}
      <div className="p-6 flex-grow flex flex-col">
        {/* Description with styled quotation mark */}
        <div className="relative mb-6 mt-2">
          <div className="absolute -top-4 -left-1 text-4xl text-indigo-200 font-serif">
            "
          </div>
          <p className="text-gray-600 text-sm pl-4 line-clamp-2 italic">
            {campaign.description || "Không có mô tả cho chiến dịch này."}
          </p>
          <div className="absolute bottom-0 right-0 text-4xl text-indigo-200 font-serif leading-none">
            "
          </div>
        </div>

        {/* Progress section with enhanced styling */}
        <div className="mt-auto space-y-6">
          {/* Progress ring and stats */}
          <div className="flex items-start justify-between">
            {/* Progress circle */}
            <div className="relative">
              <svg width="80" height="80" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(339.3 * progress) / 100} ${339.3}`}
                  strokeDashoffset="0"
                  transform="rotate(-90 60 60)"
                />
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-indigo-700">
                  {progress}%
                </span>
              </div>
            </div>

            {/* Raised amount */}
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(campaign.collectedAmount)}
              </div>
              <div className="text-sm text-gray-500">
                mục tiêu{" "}
                <span className="font-medium">
                  {formatCurrency(campaign.targetAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Stats with glass effect styling */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-100/50">
              <Users size={16} className="mr-2 text-indigo-600" />
              <span className="font-medium text-gray-700">
                {donorCount} người ủng hộ
              </span>
            </div>

            {daysLeft !== null && (
              <div className="flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-100/50">
                <Calendar size={16} className="mr-2 text-indigo-600" />
                <span className="font-medium text-gray-700">
                  {daysLeft > 0 ? `Còn ${daysLeft} ngày` : "Đã kết thúc"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action button with floating effect */}
      <div className="px-6 pb-6 pt-1">
        <Link
          href={`/campaign/${campaign.slug || campaign.id}`}
          className="block w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white text-center py-3.5 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 relative overflow-hidden group"
        >
          <span className="relative z-10">Ủng hộ ngay</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="absolute -inset-full top-0 block w-1/2 h-full z-5 transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine"></div>
        </Link>
      </div>

      {/* Global card styling - add animation keyframes */}
      <style jsx>{`
        @keyframes shine {
          from {
            left: -100%;
            opacity: 0;
          }
          to {
            left: 100%;
            opacity: 0.3;
          }
        }
        .group-hover\\:animate-shine:hover {
          animation: shine 1.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CampaignCardVertical;
