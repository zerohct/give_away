import React from "react";
import { Campaign } from "@/types/campaign";
import { formatCurrency } from "@/lib/utils/format";
import { formatShortDate } from "@/lib/utils/dateFormatter";
import { Edit, Trash, FileText, Heart } from "lucide-react";
import Link from "next/link";
import CampaignStatusBadge from "./CampaignStatusBadge";
import ProgressBar from "../../ui/ProgressBar";

interface CampaignTableProps {
  campaigns: Campaign[];
  onDeleteClick: (id: number) => void;
}

export default function CampaignTable({
  campaigns,
  onDeleteClick,
}: CampaignTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-purple-50 to-blue-50 text-gray-700">
            <th className="px-6 py-4 text-left">Campaign</th>
            <th className="px-6 py-4 text-left">Progress</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Created</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => {
            const progressPercentage =
              (campaign.collectedAmount / campaign.targetAmount) * 100;

            return (
              <tr
                key={campaign.id}
                className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      {campaign.isFeatured ? (
                        <Heart
                          className="h-6 w-6 text-pink-500"
                          fill="currentColor"
                        />
                      ) : (
                        <FileText className="h-6 w-6 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-1">
                        {campaign.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {campaign.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        <span className="font-medium">
                          {formatCurrency(campaign.collectedAmount)}
                        </span>
                        <span className="text-gray-500">
                          {" "}
                          / {formatCurrency(campaign.targetAmount)}
                        </span>
                      </span>
                      <span className="font-medium">
                        {progressPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <ProgressBar
                      value={progressPercentage}
                      color={
                        progressPercentage > 75
                          ? "green"
                          : progressPercentage > 40
                          ? "blue"
                          : "purple"
                      }
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <CampaignStatusBadge status={campaign.status} />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-sm text-gray-500">
                    {formatShortDate(campaign.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Link href={`/admin/campaigns/${campaign.id}/edit`}>
                      <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                    </Link>
                    <button
                      className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors"
                      onClick={() => onDeleteClick(campaign.id)}
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
