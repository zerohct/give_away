import React from 'react';
import { useRouter } from 'next/router';

const Campaign: React.FC = () => {
  const router = useRouter();

  // Danh sách các hoạt động (giả sử)
  const activities = [
    {
      id: '1',
      title: 'Xây dựng nhà tình thương',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqe20di2mYMHa5Fdf0GRbqBor8jtkJyOdIQQ&s',
      description: 'Chúng tôi đã xây dựng hơn 100 ngôi nhà cho các gia đình nghèo trên khắp cả nước.',
    },
    {
      id: '2',
      title: 'Trao học bổng cho trẻ em',
      image: 'https://nld.mediacdn.vn/291774122806476800/2022/4/8/1-dai-dien-bao-nguoi-lao-dong-trao-qua-ho-tro-hoc-sinh-sinh-vien-dan-toc-thieu-so-tinh-dong-thap-16494018520541570205560.jpg',
      description: 'Hỗ trợ học bổng và dụng cụ học tập cho hơn 1,000 trẻ em có hoàn cảnh khó khăn.',
    },
    {
      id: '3',
      title: 'Phát quà từ thiện',
      image: 'https://www.iahdrai.kontum.gov.vn/Uploads/images/t%201.jpg',
      description: 'Phát quà và nhu yếu phẩm cho các gia đình nghèo trong dịp Tết Nguyên Đán.',
    },
  ];

  const handleClick = (id: string) => {
    router.push(`/campaign/${id}`); // Chuyển hướng đến trang chi tiết
  };

  return (
    <section className="activities-section">
      <h2>Các hoạt động nổi bật</h2>
      <div className="activity-grid">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="activity-card"
            onClick={() => handleClick(activity.id)} // Thêm sự kiện onClick
          >
            <img src={activity.image} alt={activity.title} className="activity-image" />
            <h3>{activity.title}</h3>
            <p>{activity.description}</p>
            <a href={`/campaign/${activity.id}`} className="learn-more-button">
              Tìm hiểu thêm
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Campaign;