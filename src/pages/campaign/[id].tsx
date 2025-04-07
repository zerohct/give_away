// pages/campaign/[id].tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ApiService } from "@/services/ApiService";
import { ENDPOINTS } from "@/lib/constants/apiEndpoints";
import Image from "next/image";
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  ArrowLeftIcon,
  HeartIcon,
  CheckCircleIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface Campaign {
  id: number;
  title: string;
  description: string | null;
  emoji?: string;
  category?: string;
  location?: string;
  slug?: string;
  startDate?: string;
  deadline?: string;
  tags?: string[] | string;
  collectedAmount: number;
  targetAmount: number;
  donationCount: number;
  media: {
    url: string;
    base64Image?: string;
  }[];
  createdBy?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function CampaignDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState(100000);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState<
    { id: number; name: string; content: string }[]
  >([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchCampaign = async () => {
      try {
        const response = await ApiService.get<{ data: Campaign }>(
          ENDPOINTS.CAMPAIGNS.DETAILS(String(id))
        );
        if (response?.data?.data) {
          setCampaign(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu chiến dịch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
        />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 max-w-md mx-auto bg-white rounded-2xl shadow-xl"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Không tìm thấy chiến dịch
          </h2>
          <p className="text-gray-600 mb-6">
            Chiến dịch bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => router.push("/campaigns")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-all"
          >
            Xem các chiến dịch khác
          </button>
        </motion.div>
      </div>
    );
  }

  // Get current media
  const currentMedia =
    campaign.media?.[currentImageIndex] || campaign.media?.[0];
  const imageSrc = currentMedia?.base64Image
    ? currentMedia.base64Image
    : currentMedia?.url?.startsWith("http")
    ? currentMedia.url
    : currentMedia?.url
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace(
        /\/$/,
        ""
      )}/${currentMedia.url.replace(/^\/?/, "")}`
    : "/default-campaign.jpg";

  const percent = Math.min(
    (campaign.collectedAmount / campaign.targetAmount) * 100,
    100
  );

  const formatDate = (dateString?: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString("vi-VN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  const daysLeft = () => {
    if (!campaign.deadline) return "Không giới hạn";
    const deadline = new Date(campaign.deadline);
    const today = new Date();
    const diffDays = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays > 0 ? `${diffDays} ngày` : "Đã kết thúc";
  };

  const handleDonationAmountChange = (amount: number) => {
    setDonationAmount(amount);
  };

  const formatPrice = (price: number) => price.toLocaleString("vi-VN");

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          name: "Người dùng",
          content: newComment.trim(),
        },
      ]);
      setNewComment("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <button
            onClick={() => router.push("/")}
            className="hover:text-blue-600"
          >
            Trang chủ
          </button>
          <span className="mx-1">›</span>
          <button
            onClick={() => router.push("/campaigns")}
            className="hover:text-blue-600"
          >
            Các chiến dịch
          </button>
          <span className="mx-1">›</span>
          {campaign.category && (
            <>
              <button
                onClick={() => router.push(`/category/${campaign.category}`)}
                className="hover:text-blue-600"
              >
                {campaign.category}
              </button>
              <span className="mx-1">›</span>
            </>
          )}
          <span className="">{campaign.title}</span>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex flex-col md:flex-row">
            {/* Left side: Campaign Images */}
            <div className="md:w-[450px] flex-shrink-0 p-6">
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-50 mb-4">
                <Image
                  src={imageSrc}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 450px"
                />
              </div>

              {/* Social Sharing */}
              <div className="flex items-center mt-6">
                <span className="text-sm text-gray-600 mr-3">
                  Chia sẻ chiến dịch:
                </span>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm"
                  >
                    f
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                    </svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-sm"
                  >
                    Z
                  </motion.button>
                </div>
                <div className="ml-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center text-rose-500"
                  ></motion.button>
                </div>
              </div>
            </div>

            {/* Right side: Campaign info */}
            <div className="flex-1 p-6 border-l border-gray-100">
              {/* Campaign title with badge */}
              <div className="mb-4">
                {campaign.category && (
                  <span className="inline-block bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full mr-2 mb-2">
                    {campaign.category}
                  </span>
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  {campaign.title}
                </h1>
              </div>

              {/* Creator info */}
              {campaign.createdBy && (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center space-x-3 mb-6 bg-gray-50 p-3 rounded-lg"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 overflow-hidden">
                    {campaign.createdBy.avatar ? (
                      <Image
                        src={campaign.createdBy.avatar}
                        alt={campaign.createdBy.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                        <UserIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">
                      Người tạo chiến dịch
                    </div>
                    <div className="font-semibold text-gray-800">
                      {campaign.createdBy.name}
                    </div>
                  </div>
                  <div className="ml-auto bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    Xem hồ sơ
                  </div>
                </motion.div>
              )}

              {/* Campaign info badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <motion.div
                  whileHover={{ y: -2 }}
                  className="flex items-center text-sm text-gray-700 bg-blue-50 px-4 py-2 rounded-full shadow-sm"
                >
                  <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                  <span>
                    {formatDate(campaign.startDate)}
                    {campaign.deadline
                      ? ` - ${formatDate(campaign.deadline)}`
                      : ""}
                  </span>
                </motion.div>
                {campaign.location && (
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="flex items-center text-sm text-gray-700 bg-green-50 px-4 py-2 rounded-full shadow-sm"
                  >
                    <MapPinIcon className="h-5 w-5 mr-2 text-green-500" />
                    <span>{campaign.location}</span>
                  </motion.div>
                )}
                {campaign.emoji && (
                  <div className="absolute top-4 left-4 text-4xl">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      {campaign.emoji}
                    </motion.span>
                  </div>
                )}
                {campaign.deadline && (
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`flex items-center text-sm font-semibold ${
                      daysLeft() === "Đã kết thúc"
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                    } px-4 py-2 rounded-full shadow-sm`}
                  >
                    <span>
                      {daysLeft() === "Đã kết thúc"
                        ? "Đã kết thúc"
                        : `Còn lại: ${daysLeft()}`}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Tags */}
              {campaign.tags && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {(typeof campaign.tags === "string"
                    ? campaign.tags.split(",")
                    : campaign.tags
                  ).map((tag, index) => (
                    <motion.span
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-full shadow-sm"
                    >
                      #{tag.trim()}
                    </motion.span>
                  ))}
                </div>
              )}

              {/* Progress bar in Shopee style */}
              <div className="bg-gray-50 rounded-xl p-5 mb-6 shadow-sm">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatPrice(campaign.collectedAmount)} VNĐ
                    </p>
                    <p className="text-sm text-gray-500">
                      trên mục tiêu {formatPrice(campaign.targetAmount)} VNĐ
                    </p>
                  </div>
                  <p className="text-xl font-bold text-blue-600">
                    {percent.toFixed(1)}%
                  </p>
                </div>
                <div className="h-3 bg-gray-200 rounded-full mb-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mt-3">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{campaign.donationCount} lượt quyên góp</span>
                  </div>
                  {campaign.deadline && (
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{daysLeft()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Donation Options in Shopee style */}
              <div className="mb-6">
                <div className="mb-3">
                  <span className="text-gray-700 font-medium">
                    Lựa chọn số tiền quyên góp:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {[50000, 100000, 200000, 500000, 1000000].map((amount) => (
                    <motion.button
                      key={amount}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg ${
                        donationAmount === amount
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleDonationAmountChange(amount)}
                    >
                      {formatPrice(amount)} đ
                    </motion.button>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg ${
                      ![50000, 100000, 200000, 500000, 1000000].includes(
                        donationAmount
                      )
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setDonationAmount(0)}
                  >
                    Khác
                  </motion.button>
                </div>

                {![50000, 100000, 200000, 500000, 1000000].includes(
                  donationAmount
                ) && (
                  <div className="mb-4">
                    <div className="flex items-center">
                      <span className="text-gray-700 mr-2">Số tiền:</span>
                      <input
                        type="number"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={donationAmount || ""}
                        onChange={(e) =>
                          setDonationAmount(Number(e.target.value))
                        }
                        placeholder="Nhập số tiền quyên góp..."
                      />
                      <span className="ml-2 text-gray-600">VNĐ</span>
                    </div>
                  </div>
                )}

                {/* Donation guarantees */}
                <div className="mb-6">
                  <div className="flex items-center text-gray-600 mb-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>100% số tiền sẽ đến tay người nhận</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Nhận thông báo cập nhật về tiến độ chiến dịch</span>
                  </div>
                </div>

                {/* Donate button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <HeartIcon className="h-6 w-6 animate-pulse" />
                  <span>
                    Quyên góp ngay{" "}
                    {donationAmount > 0
                      ? formatPrice(donationAmount) + " VNĐ"
                      : ""}
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Thông tin chi tiết chiến dịch
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            {campaign.description ? (
              <p className="whitespace-pre-line">{campaign.description}</p>
            ) : (
              <p className="italic text-gray-500">
                Không có mô tả chi tiết cho chiến dịch này.
              </p>
            )}
          </div>
        </motion.div>

        {/* Phần bình luận */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Bình luận</h2>

          {/* Form thêm bình luận */}
          <div className="mb-6">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Viết bình luận của bạn..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={handleAddComment}
              className="mt-3 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              Gửi bình luận
            </button>
          </div>

          {/* Danh sách bình luận */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="font-semibold text-gray-800">
                    {comment.name}
                  </div>
                  <p className="text-gray-600">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                Chưa có bình luận nào. Hãy là người đầu tiên!
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
