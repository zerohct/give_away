// src/pages/CampaignDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCampaign } from "@/context/CampaignContext";
import CampaignCardHorizontal from "@/components/campaigns/client/CampaignCardHorizontal";
import { formatCurrency } from "@/lib/utils/format";

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentCampaign, loading, error, fetchCampaignById, campaigns } =
    useCampaign();
  const [donationAmount, setDonationAmount] = useState<number>(100000);
  const [showDonationForm, setShowDonationForm] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchCampaignById(id);
    }
  }, [id, fetchCampaignById]);

  // Find related campaigns (same category, excluding current)
  const relatedCampaigns = campaigns
    .filter(
      (campaign) =>
        campaign.category === currentCampaign?.category &&
        campaign.id !== currentCampaign?.id
    )
    .slice(0, 3);

  const progress =
    currentCampaign?.currentAmount && currentCampaign?.targetAmount
      ? Math.min(
          Math.round(
            (currentCampaign.currentAmount / currentCampaign.targetAmount) * 100
          ),
          100
        )
      : 0;

  const daysLeft = currentCampaign?.deadline
    ? Math.max(
        0,
        Math.ceil(
          (new Date(currentCampaign.deadline).getTime() -
            new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  if (loading && !currentCampaign) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
      </div>
    );
  }

  if (error || !currentCampaign) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Không tìm thấy chiến dịch
        </h2>
        <p className="text-gray-600 mb-8">
          {error || "Chiến dịch không tồn tại hoặc đã bị xóa."}
        </p>
        <button
          onClick={() => navigate("/campaigns")}
          className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Xem tất cả chiến dịch
        </button>
      </div>
    );
  }

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Cảm ơn bạn đã quyên góp ${formatCurrency(
        donationAmount
      )} cho chiến dịch "${currentCampaign.title}"`
    );
    setShowDonationForm(false);
  };

  const predefinedAmounts = [50000, 100000, 200000, 500000, 1000000];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/campaigns"
          className="text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Quay lại danh sách
        </Link>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-8">
        <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-100">
          <img
            src={
              currentCampaign.imageUrl || "/images/default-campaign-large.jpg"
            }
            alt={currentCampaign.title}
            className="w-full h-full object-cover"
          />
          {currentCampaign.emoji && (
            <span className="absolute top-4 left-4 text-4xl">
              {currentCampaign.emoji}
            </span>
          )}
          {currentCampaign.isFeatured && (
            <span className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full font-medium">
              Chiến dịch nổi bật
            </span>
          )}
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
              {currentCampaign.category || "Chiến dịch"}
            </span>
            {currentCampaign.location && (
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                <svg
                  className="w-4 h-4 inline-block mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {currentCampaign.location}
              </span>
            )}
            {currentCampaign.tags &&
              currentCampaign.tags.length > 0 &&
              Array.isArray(currentCampaign.tags) &&
              currentCampaign.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {currentCampaign.title}
          </h1>

          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
              <img
                src={
                  currentCampaign.user?.avatar || "/images/default-avatar.png"
                }
                alt={currentCampaign.user?.name || ""}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {currentCampaign.user?.name || "Ẩn danh"}
              </p>
              <p className="text-sm text-gray-500">
                Tạo ngày {currentCampaign.createdAt.toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-8 mb-4">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Đã quyên góp</p>
                <p className="text-2xl font-bold text-indigo-700">
                  {formatCurrency(currentCampaign.currentAmount || 0)}
                </p>
                <p className="text-sm text-gray-500">
                  từ mục tiêu {formatCurrency(currentCampaign.targetAmount)}
                </p>
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Tiến độ</p>
                <p className="text-2xl font-bold text-indigo-700">
                  {progress}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Thời gian còn lại</p>
                <p className="text-2xl font-bold text-indigo-700">
                  {daysLeft > 0 ? `${daysLeft} ngày` : "Đã kết thúc"}
                </p>
                <p className="text-sm text-gray-500">
                  {currentCampaign.deadline
                    ? `Kết thúc vào ${new Date(
                        currentCampaign.deadline
                      ).toLocaleDateString("vi-VN")}`
                    : "Không có hạn chót"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDonationForm(!showDonationForm)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              {showDonationForm ? "Đóng biểu mẫu" : "Quyên góp ngay"}
            </button>

            {showDonationForm && (
              <form
                onSubmit={handleDonate}
                className="mt-4 p-4 border border-gray-200 rounded-lg"
              >
                <h3 className="text-lg font-bold mb-4">
                  Chọn số tiền quyên góp
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      type="button"
                      key={amount}
                      onClick={() => setDonationAmount(amount)}
                      className={`py-2 px-4 rounded-lg border transition-colors ${
                        donationAmount === amount
                          ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="custom-amount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hoặc nhập số tiền khác
                  </label>
                  <input
                    type="number"
                    id="custom-amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    min="1000"
                    step="1000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                >
                  Tiếp tục
                </button>
              </form>
            )}
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Thông tin chi tiết</h2>
            <div className="whitespace-pre-line text-gray-700">
              {currentCampaign.description}
            </div>
          </div>

          {currentCampaign.media && currentCampaign.media.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Hình ảnh và videos</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentCampaign.media.map((item, index) => (
                  <div
                    key={index}
                    className="relative h-24 md:h-32 bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={item.url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {relatedCampaigns.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Các chiến dịch liên quan</h2>
          <div className="space-y-6">
            {relatedCampaigns.map((campaign) => (
              <CampaignCardHorizontal key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetail;
