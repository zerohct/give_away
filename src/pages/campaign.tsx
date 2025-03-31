import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ApiService } from "../services/ApiService";
import { ENDPOINTS } from "../lib/constants/apiEndpoints";  
import MainLayout from "../components/layouts/MainLayout";

const Campaign = () => {
  const [campaign, setCampaign] = useState<any | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const getCampaign = async () => {
      try {
        const response = await ApiService.get<any>(
          `${ENDPOINTS.CAMPAIGNS.DETAILS}/${id}`
        );
        setCampaign(response.data);
      } catch (error) {
        console.error("Failed to fetch campaign details", error);
      }
    };
    if (id) getCampaign();
  }, [id]);

  if (!campaign) return <div>Loading...</div>;

  return (
    <MainLayout>
      <h2>{campaign.name}</h2>
      <p>{campaign.description}</p>
      <h3>Goal: ${campaign.goal}</h3>
    </MainLayout>
  );
};

export default Campaign;
