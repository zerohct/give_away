// components/CampaignCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Campaign } from "@/types/campaign";
import { formatCurrency } from "@/lib/utils/format";

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard = ({ campaign }: CampaignCardProps) => {
  // Find primary image or use first available
  const primaryImage =
    campaign.media?.find((m) => m.isPrimary) || campaign.media?.[0];
  const progress =
    campaign.targetAmount > 0
      ? Math.min(
          Math.round((campaign.collectedAmount / campaign.targetAmount) * 100),
          100
        )
      : 0;

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Link href={`/campaigns/${campaign.slug || campaign.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Campaign Image */}
        <div className="relative h-48 bg-gray-200">
          {primaryImage ? (
            primaryImage.base64Image ? (
              <img
                src={primaryImage.base64Image}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={primaryImage.url}
                alt={campaign.title}
                fill
                className="object-cover"
              />
            )
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <span className="text-4xl">{campaign.emoji || "🎁"}</span>
            </div>
          )}

          {/* Featured Badge */}
          {campaign.isFeatured && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              Featured
            </div>
          )}
        </div>

        {/* Campaign Info */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
              {campaign.title}
            </h3>
            {campaign.category && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {campaign.category}
              </span>
            )}
          </div>

          {campaign.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {campaign.description}
            </p>
          )}

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Amount */}
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-800">
              {formatCurrency(campaign.collectedAmount)}
            </span>
            <span className="text-gray-600">
              of {formatCurrency(campaign.targetAmount)}
            </span>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
            <div>
              <span>{campaign.donationCount} donors</span>
            </div>
            <div>
              {campaign.deadline && (
                <span>Ends: {formatDate(campaign.deadline)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
