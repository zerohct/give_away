import { useRouter } from 'next/router';
import CampaignDetail from '../../components/CampaignDetail';

const CampaignPage = () => {
  const router = useRouter();
  const { id } = router.query; // Lấy `id` từ URL

  // Giả sử bạn có một hàm để lấy dữ liệu chi tiết từ `id`
  const campaignData = {
    id: Array.isArray(id) ? id[0] : id || '',
    title: "Xin hãy giúp cô bé Ba Na, Siu Nữ giữ lại ánh sáng yêu thương cho mắt trái còn lại",
    image: "https://via.placeholder.com/800x400",
    description: "Lanh lợi và đáng yêu, cô bé Siu Nữ 18 tháng tuổi, dân tộc Ba Na đang bỏ lỡ những câu nói đầu đời...",
    target: 50000000,
    raised: 350000,
  };

  return <CampaignDetail campaign={campaignData} />;
};

export default CampaignPage;