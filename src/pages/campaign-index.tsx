import React, { useState, useEffect } from "react";
import { useCampaign } from "@/context/CampaignContext";
import CampaignCardVertical from "@/components/campaigns/client/CampaignCardVertical";

import { Campaign } from "@/types";
import {
  Search,
  Filter,
  ChevronDown,
  Heart,
  Calendar,
  Users,
  TrendingUp,
  X,
} from "lucide-react";
import Image from "next/image";
import CampaignCardVertical2 from "@/components/campaigns/client/CampaignCardVertical2";
import { formatCurrency } from "@/lib/utils/format";
const CampaignIndex: React.FC = () => {
  const { campaigns, loading, error, fetchCampaigns } = useCampaign();
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);

  useEffect(() => {
    if (campaigns.length === 0) {
      fetchCampaigns();
    }
  }, [campaigns.length, fetchCampaigns]);

  useEffect(() => {
    let result = [...campaigns];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(query) ||
          campaign.description?.toLowerCase().includes(query) ||
          campaign.category?.toLowerCase().includes(query) ||
          campaign.location?.toLowerCase().includes(query) ||
          (campaign.tags &&
            (typeof campaign.tags === "string"
              ? campaign.tags.toLowerCase().includes(query)
              : campaign.tags.some((tag) => tag.toLowerCase().includes(query))))
      );
    }

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter(
        (campaign) => campaign.category === activeCategory
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(
        (campaign) =>
          campaign.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Filter by featured
    if (featuredOnly) {
      result = result.filter((campaign) => campaign.isFeatured);
    }

    // Sort campaigns
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "endingSoon":
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        case "mostFunded":
          return b.collectedAmount - a.collectedAmount;
        case "mostDonors":
          return (b.donationCount || 0) - (a.donationCount || 0);
        case "progress":
          const progressA = a.targetAmount
            ? a.collectedAmount / a.targetAmount
            : 0;
          const progressB = b.targetAmount
            ? b.collectedAmount / b.targetAmount
            : 0;
          return progressB - progressA;
        default:
          return 0;
      }
    });

    setFilteredCampaigns(result);
  }, [
    campaigns,
    activeCategory,
    searchQuery,
    sortBy,
    statusFilter,
    featuredOnly,
  ]);

  // Format currency function that ensures proper formatting without leading zeros
  const formatTotalAmount = (amount: number | string): string => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || amount === null || amount === undefined) {
      return "0 ₫";
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  };
  // Calculate total funds raised
  const totalFundsRaised = campaigns.reduce((sum, campaign) => {
    // First check if collectedAmount exists
    if (
      campaign.collectedAmount === undefined ||
      campaign.collectedAmount === null
    ) {
      return sum;
    }

    // Then ensure it's a number (handle both string and number types)
    const amount =
      typeof campaign.collectedAmount === "string"
        ? parseFloat(campaign.collectedAmount)
        : campaign.collectedAmount;

    // Only add valid numbers
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  // Extract unique categories from campaigns
  const categories = [
    "all",
    ...Array.from(new Set(campaigns.map((c) => c.category || "Khác"))),
  ];

  // Extract unique statuses from campaigns
  const statuses = [
    "all",
    ...Array.from(new Set(campaigns.map((c) => c.status))),
  ];

  if (loading && campaigns.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
          <p className="mt-4 text-gray-600">Đang tải chiến dịch...</p>
        </div>
      </div>
    );
  }

  if (error && campaigns.length === 0) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-xl max-w-lg mx-auto">
        <div className="text-red-500 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-red-700 mb-2">Đã xảy ra lỗi</h3>
        <p className="text-gray-700 mb-4">{error}</p>
        <button
          onClick={() => fetchCampaigns()}
          className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors flex items-center mx-auto"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-indigo-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-indigo-600/80"></div>
          <Image
            src="/images/charity-bg.jpg"
            alt="Charity background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Chia sẻ yêu thương,{" "}
              <span className="text-yellow-300">kết nối tương lai</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8">
              Khám phá các chiến dịch từ thiện đang cần sự hỗ trợ. Mỗi đóng góp
              của bạn, dù nhỏ, đều có thể tạo nên sự khác biệt lớn trong cuộc
              sống của nhiều người.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-indigo-700 hover:bg-yellow-300 font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center">
                <Heart className="w-5 h-5 mr-2" />
                Tạo chiến dịch mới
              </button>
              <button className="border border-white text-white hover:bg-white hover:text-indigo-700 font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats summary - FIXED DISPLAY OF FUNDRAISING AMOUNT */}
      <div className="container mx-auto px-4 -mt-8 mb-8 relative z-20">
        <div className="bg-white rounded-xl shadow-xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4">
            <div className="text-indigo-600 mb-2">
              <Users className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {campaigns.length}
            </p>
            <p className="text-gray-500">Chiến dịch đang hoạt động</p>
          </div>
          <div className="text-center p-4">
            <div className="text-indigo-600 mb-2">
              <Heart className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {campaigns
                .reduce(
                  (sum, campaign) => sum + (campaign.donationCount || 0),
                  0
                )
                .toLocaleString()}
            </p>
            <p className="text-gray-500">Lượt ủng hộ</p>
          </div>
          <div className="text-center p-4">
            <div className="text-indigo-600 mb-2">
              <TrendingUp className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {formatCurrency(totalFundsRaised)}
            </p>
            <p className="text-gray-500">Tổng số tiền gây quỹ</p>
          </div>
          <div className="text-center p-4">
            <div className="text-indigo-600 mb-2">
              <Calendar className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {
                campaigns.filter(
                  (c) => c.deadline && new Date(c.deadline) > new Date()
                ).length
              }
            </p>
            <p className="text-gray-500">Chiến dịch sắp kết thúc</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Các chiến dịch từ thiện
            </h2>

            {/* Search */}
            <div className="w-full md:w-auto relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm chiến dịch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category === "all" ? "Tất cả" : category}
                </button>
              ))}
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-wrap gap-3">
              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                >
                  <Filter className="w-4 h-4" />
                  <span>Bộ lọc</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showFilterMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                    <div className="p-4">
                      <h4 className="font-medium text-gray-700 mb-3">
                        Sắp xếp
                      </h4>
                      <div className="space-y-2">
                        {[
                          { value: "newest", label: "Mới nhất" },
                          { value: "endingSoon", label: "Sắp kết thúc" },
                          { value: "mostFunded", label: "Gây quỹ nhiều nhất" },
                          {
                            value: "mostDonors",
                            label: "Nhiều người ủng hộ nhất",
                          },
                          { value: "progress", label: "Tiến độ cao nhất" },
                        ].map((option) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              type="radio"
                              id={option.value}
                              name="sort"
                              value={option.value}
                              checked={sortBy === option.value}
                              onChange={() => setSortBy(option.value)}
                              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={option.value}
                              className="ml-2 text-sm text-gray-700"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 my-4"></div>

                      <h4 className="font-medium text-gray-700 mb-3">
                        Trạng thái
                      </h4>
                      <div className="space-y-2">
                        {statuses.map((status) => (
                          <div key={status} className="flex items-center">
                            <input
                              type="radio"
                              id={`status-${status}`}
                              name="status"
                              value={status}
                              checked={statusFilter === status}
                              onChange={() => setStatusFilter(status)}
                              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`status-${status}`}
                              className="ml-2 text-sm text-gray-700"
                            >
                              {status === "all" ? "Tất cả trạng thái" : status}
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 my-4"></div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featuredOnly"
                          checked={featuredOnly}
                          onChange={() => setFeaturedOnly(!featuredOnly)}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor="featuredOnly"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Chỉ hiển thị chiến dịch nổi bật
                        </label>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => {
                            setStatusFilter("all");
                            setSortBy("newest");
                            setFeaturedOnly(false);
                            setShowFilterMenu(false);
                          }}
                          className="text-sm text-gray-600 hover:text-gray-800 mr-3"
                        >
                          Đặt lại
                        </button>
                        <button
                          onClick={() => setShowFilterMenu(false)}
                          className="text-sm bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
                        >
                          Áp dụng
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Campaign results */}
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Không tìm thấy chiến dịch
            </h3>
            <p className="text-gray-500 mb-4">
              Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
                setStatusFilter("all");
                setSortBy("newest");
                setFeaturedOnly(false);
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center mx-auto"
            >
              <X className="w-4 h-4 mr-1" />
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Hiển thị {filteredCampaigns.length} chiến dịch
              {activeCategory !== "all"
                ? ` trong danh mục "${activeCategory}"`
                : ""}
              {searchQuery ? ` với từ khóa "${searchQuery}"` : ""}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCampaigns.map((campaign) => (
                <CampaignCardVertical2 key={campaign.id} campaign={campaign} />
              ))}
            </div>

            {filteredCampaigns.length > 12 && (
              <div className="mt-12 text-center">
                <button className="bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-3 px-8 rounded-lg font-medium transition-colors flex items-center mx-auto">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                  Xem thêm chiến dịch
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Featured Section */}
      {campaigns.filter((c) => c.isFeatured).length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 py-12 mt-16">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-indigo-800 mb-2">
                Chiến dịch nổi bật
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Những chiến dịch cần được quan tâm đặc biệt và hỗ trợ kịp thời
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {campaigns
                .filter((c) => c.isFeatured)
                .slice(0, 3)
                .map((campaign) => (
                  <CampaignCardVertical key={campaign.id} campaign={campaign} />
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Bạn có một ý tưởng giúp đỡ cộng đồng?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Hãy bắt đầu chiến dịch gây quỹ của riêng bạn và kêu gọi cộng đồng
            cùng chung tay. Mỗi đóng góp nhỏ đều có thể tạo nên sự thay đổi lớn.
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-lg font-medium transition-colors">
            Tạo chiến dịch ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignIndex;
