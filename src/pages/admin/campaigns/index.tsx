// src/app/admin/campaigns/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useCampaign } from "@/context/CampaignContext";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Link, Loader } from "lucide-react";

// Import components
import CampaignHeader from "@/components/campaigns/admin/CampaignHeader";
import SearchBar from "@/components/campaigns/admin/SearchBar";
import CampaignTable from "@/components/campaigns/admin/CampaignTable";
import Pagination from "@/components/campaigns/admin/Pagination";
import DeleteConfirmDialog from "@/components/campaigns/admin/DeleteConfirmDialog";

export default function CampaignListPage() {
  const {
    campaigns,
    loading,
    error,
    searchResults,
    fetchCampaigns,
    deleteCampaign,
    searchCampaigns,
  } = useCampaign();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<number | null>(null);
  const pageSize = 10;

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchCampaigns(searchQuery, currentPage, pageSize);
    } else {
      fetchCampaigns();
    }
  };

  const confirmDelete = (id: number) => {
    setCampaignToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (campaignToDelete) {
      await deleteCampaign(campaignToDelete);
      setIsDeleteDialogOpen(false);
    }
  };

  const displayData = searchResults ? searchResults.data : campaigns;
  const totalItems = searchResults ? searchResults.total : campaigns.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    if (searchQuery.trim()) {
      await searchCampaigns(searchQuery, page, pageSize);
    }
  };

  return (
    <AdminLayout activeId="campaigns" title="Quản lý chiến dịch">
      <div className="container mx-auto p-4">
        <CampaignHeader />

        <div className="space-y-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-16 flex flex-col items-center justify-center">
              <Loader className="animate-spin text-blue-500 h-8 w-8 mb-3" />
              <span className="text-gray-500 font-medium">
                Loading campaigns...
              </span>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl shadow-sm p-16 flex flex-col items-center justify-center">
              <div className="text-red-500 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Error Loading Campaigns
              </h3>
              <p className="text-gray-500 mb-4 text-center">{error}</p>
              <button
                onClick={() => fetchCampaigns()}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : displayData.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-16 flex flex-col items-center justify-center">
              <div className="text-gray-400 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No Campaigns Found
              </h3>
              <p className="text-gray-500 mb-4 text-center">
                Try a different search or create a new campaign
              </p>
              <Link href="/admin/campaigns/create">
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-colors">
                  Create Campaign
                </button>
              </Link>
            </div>
          ) : (
            <>
              <CampaignTable
                campaigns={displayData}
                onDeleteClick={confirmDelete}
              />

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>

        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={handleDelete}
        />
      </div>
    </AdminLayout>
  );
}
