import React from "react";
import { useRouter } from "next/router";

const Campaign: React.FC = () => {
  const router = useRouter();

  // Danh sách các hoạt động (giả sử)
  const activities = [
    {
      id: "1",
      title: "Xây dựng nhà tình thương",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqe20di2mYMHa5Fdf0GRbqBor8jtkJyOdIQQ&s",
      description:
        "Chúng tôi đã xây dựng hơn 100 ngôi nhà cho các gia đình nghèo trên khắp cả nước.",
    },
    {
      id: "2",
      title: "Trao học bổng cho trẻ em",
      image:
        "https://nld.mediacdn.vn/291774122806476800/2022/4/8/1-dai-dien-bao-nguoi-lao-dong-trao-qua-ho-tro-hoc-sinh-sinh-vien-dan-toc-thieu-so-tinh-dong-thap-16494018520541570205560.jpg",
      description:
        "Hỗ trợ học bổng và dụng cụ học tập cho hơn 1,000 trẻ em có hoàn cảnh khó khăn.",
    },
    {
      id: "3",
      title: "Phát quà từ thiện",
      image: "https://www.iahdrai.kontum.gov.vn/Uploads/images/t%201.jpg",
      description:
        "Phát quà và nhu yếu phẩm cho các gia đình nghèo trong dịp Tết Nguyên Đán.",
    },
  ];

  const handleClick = (id: string) => {
    router.push(`/campaign/${id}`);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-800 relative">
          <span className="relative z-10">Các hoạt động nổi bật</span>
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-400 rounded"></span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {activity.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {activity.description}
                </p>
                <button
                  onClick={() => handleClick(activity.id)}
                  className="inline-flex items-center justify-center w-full py-3 px-5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span>Tìm hiểu thêm</span>
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Campaign;
