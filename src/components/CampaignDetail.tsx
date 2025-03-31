import React from 'react';


interface Campaign {
  id: string;
  title: string;
  image: string;
  description: string;
  target: number;
  raised: number;
}

interface CampaignDetailProps {
  campaign: Campaign;
}

const CampaignDetail: React.FC<CampaignDetailProps> = ({ campaign }) => {
  return (
    <div className="campaign-detail-container">
      {/* Phần tiêu đề và hình ảnh */}
      <section className="campaign-header">
        <h1>{campaign.title}</h1>
        <img src={campaign.image} alt={campaign.title} className="campaign-image" />
      </section>

      {/* Phần thông tin dự án */}
      <section className="campaign-info">
        <div className="campaign-stats">
          <div className="stat-item">
            <h3>Mục tiêu dự án</h3>
            <p>{campaign.target.toLocaleString()} VNĐ</p>
          </div>
          <div className="stat-item">
            <h3>Đã đạt được</h3>
            <p>{campaign.raised.toLocaleString()} VNĐ</p>
          </div>
        </div>

        {/* Nút ủng hộ và chia sẻ */}
        <div className="campaign-actions">
          <button className="donate-button">Ủng hộ ngay</button>
          <button className="share-button">Trở thành sứ giả</button>
        </div>
      </section>

      {/* Phần nội dung chi tiết */}
      <section className="campaign-content">
        <h2>Nội dung</h2>
        <p>{campaign.description}</p>
        <h3>Danh sách ủng hộ</h3>
        <ul className="donation-list">
          <li>Nguyễn Văn A - 100.000 VNĐ</li>
          <li>Trần Thị B - 50.000 VNĐ</li>
          <li>Lê Văn C - 200.000 VNĐ</li>
        </ul>
      </section>
    </div>
  );
};

export default CampaignDetail;