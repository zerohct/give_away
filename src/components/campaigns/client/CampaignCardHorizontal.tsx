import React from "react";
import { Campaign } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils/format";
import { Calendar, MapPin, Users, Heart, Clock, Tag, Info } from "lucide-react";
import {
  formatDate,
  formatTimeRemaining,
  getRelativeTime,
} from "@/lib/utils/dateFormatter";

interface CampaignCardHorizontalProps {
  campaign: Campaign;
  onClick?: (id: string) => void;
  showFullDescription?: boolean;
}

const CampaignCardHorizontal: React.FC<CampaignCardHorizontalProps> = ({
  campaign,
  onClick,
  showFullDescription = false,
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

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick(campaign.id.toString());
    }
  };

  // Get formatted time remaining (for deadline display)
  const timeRemaining = campaign.deadline
    ? formatTimeRemaining(campaign.deadline)
    : null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-full">
      {/* Image container with overlay elements */}
      <div className="relative h-64 overflow-hidden group">
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
            width={800}
            height={500}
            priority={true}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>

        {/* Category pill */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-1 rounded-full text-sm font-medium flex items-center">
          <Tag size={16} className="mr-2" />
          {campaign.category || "Khác"}
        </div>

        {/* Status and featured badges */}
        <div className="absolute top-4 right-4 flex gap-3 items-center">
          {campaign.isFeatured && (
            <span className="bg-yellow-500 text-white font-bold px-4 py-1 rounded-full flex items-center">
              <Heart size={14} className="mr-2" />
              Nổi bật
            </span>
          )}

          <span
            className={`${getStatusColor(
              campaign.status
            )} font-medium px-4 py-1 rounded-full flex items-center`}
          >
            <Info size={14} className="mr-2" />
            {campaign.status}
          </span>
        </div>

        {/* Emoji display */}
        {campaign.emoji && (
          <span className="absolute left-4 bottom-4 text-3xl filter drop-shadow-md">
            {campaign.emoji}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Creator */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{campaign.title}</h2>

          {campaign.createdBy && (
            <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                {userAvatar.startsWith("data:") ? (
                  <div
                    className="w-full h-full bg-no-repeat bg-center bg-cover"
                    style={{ backgroundImage: `url(${userAvatar})` }}
                  />
                ) : (
                  <Image
                    src={userAvatar}
                    alt={campaign.createdBy.firstName || ""}
                    width={32}
                    height={32}
                  />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {campaign.createdBy.firstName || "Ẩn danh"}
                </p>
                <p className="text-xs text-gray-500">Người tạo</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <p
            className={`text-gray-700 ${
              showFullDescription ? "" : "line-clamp-3"
            }`}
          >
            {campaign.description || "Không có mô tả cho chiến dịch này."}
          </p>
          {!showFullDescription &&
            campaign.description &&
            campaign.description.length > 180 && (
              <button
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onClick) onClick(campaign.id.toString());
                }}
              >
                Xem thêm
              </button>
            )}
        </div>

        {/* Meta information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {campaign.location && (
            <div className="flex items-center">
              <MapPin size={18} className="mr-2 text-indigo-600" />
              <span className="text-gray-700">{campaign.location}</span>
            </div>
          )}

          {campaign.createdAt && (
            <div className="flex items-center">
              <Calendar size={18} className="mr-2 text-indigo-600" />
              <span className="text-gray-700">
                Tạo: {getRelativeTime(campaign.createdAt)}
              </span>
            </div>
          )}

          {campaign.deadline && (
            <div className="flex items-center">
              <Clock size={18} className="mr-2 text-indigo-600" />
              <span className="text-gray-700">{timeRemaining}</span>
            </div>
          )}

          <div className="flex items-center">
            <Users size={18} className="mr-2 text-indigo-600" />
            <span className="text-gray-700">{donorCount} người ủng hộ</span>
          </div>
        </div>

        {/* Progress section */}
        <div className="bg-gray-50 p-4 rounded-xl mb-6">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-medium text-gray-700">Tiến độ</span>
            <span className="font-bold text-indigo-700">{progress}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(campaign.collectedAmount)}
              </p>
              <p className="text-sm text-gray-500">đã quyên góp</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-medium text-gray-900">
                {formatCurrency(campaign.targetAmount)}
              </p>
              <p className="text-sm text-gray-500">mục tiêu</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick(campaign.id.toString());
            }}
            className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3 px-6 rounded-lg font-bold transition-colors"
          >
            Ủng hộ ngay
          </button>

          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-3 rounded-lg transition-colors"
          >
            <Heart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCardHorizontal;
