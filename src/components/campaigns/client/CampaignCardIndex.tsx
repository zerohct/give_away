import React from "react";
import { Campaign } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface CampaignCardIndexProps {
  campaign: Campaign;
}

const CampaignCardIndex: React.FC<CampaignCardIndexProps> = ({ campaign }) => {
  // Get the main image - prioritize base64 images
  const getPrimaryImage = () => {
    const primaryMedia = campaign.media?.find((m) => m.isPrimary);

    if (primaryMedia?.base64Image) {
      return primaryMedia.base64Image;
    }

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

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 flex flex-col h-full border border-gray-100 transform hover:-translate-y-2 hover:scale-105">
      {/* Image container with dynamic effects */}
      <div className="relative h-64 overflow-hidden">
        {isBase64Image ? (
          <div
            className="w-full h-full bg-no-repeat bg-center bg-cover transition-all duration-1000 ease-out transform group-hover:scale-110 group-hover:rotate-1"
            style={{ backgroundImage: `url(${mainImage})` }}
          />
        ) : (
          <Image
            src={mainImage}
            alt={campaign.title}
            className="w-full h-full object-cover transition-all duration-1000 ease-out transform group-hover:scale-110 group-hover:rotate-1"
            width={400}
            height={256}
            priority={false}
          />
        )}

        {/* Vibrant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

        {/* Category tag with bold neon effect */}
        {campaign.category && (
          <div
            className="absolute top-5 left-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-lg transform 
           transition-transform duration-300"
          >
            {campaign.category}
          </div>
        )}

        {/* Floating badge effect */}
        <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
          New
        </div>
      </div>

      {/* Content with dynamic typography and spacing */}
      <div className="p-7 flex-grow flex flex-col bg-gradient-to-b from-white to-gray-50">
        {/* Title with glowing hover */}
        <h3 className="text-2xl font-extrabold text-gray-900 mb-4 line-clamp-2 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-600">
          {campaign.title}
        </h3>

        {/* Description with subtle animation */}
        <p className="text-gray-700 text-base mb-6 line-clamp-3 leading-relaxed transition-all duration-500 group-hover:text-gray-800 group-hover:tracking-wide">
          {campaign.description || "Không có mô tả cho chiến dịch này."}
        </p>

        {/* Location with floating effect */}
        {campaign.location && (
          <div className="flex items-center text-sm text-gray-600 mt-auto bg-white/80 py-2.5 px-4 rounded-xl shadow-inner self-start transform transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
            <MapPin size={18} className="mr-2 text-purple-500 animate-bounce" />
            <span className="font-medium">{campaign.location}</span>
          </div>
        )}
      </div>

      {/* Action button with futuristic design */}
      <div className="px-7 pb-7">
        <Link
          href={`/campaign/${campaign.id}/detail`}
          className="relative block w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white text-center py-3.5 px-6 rounded-xl font-semibold uppercase tracking-wide transition-all duration-500 overflow-hidden group-hover:shadow-[0_0_25px_rgba(99,102,241,0.7)]"
        >
          <span className="relative z-10">Tìm hiểu thêm</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-all duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
        </Link>
      </div>
    </div>
  );
};

export default CampaignCardIndex;
