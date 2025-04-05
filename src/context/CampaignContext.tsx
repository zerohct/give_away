// src/context/CampaignContext.tsx
import { useState, useEffect, useCallback } from "react";
import { CampaignService } from "./../services/CampaignService";
import { Campaign } from "@/types/campaign";
import {
  CreateCampaignDTO,
  UpdateCampaignDTO,
  SearchResponse,
} from "./../services/CampaignService";

export const useCampaign = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(
    null
  );

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CampaignService.getAllCampaigns();
      setCampaigns(data);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách chiến dịch.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCampaignById = useCallback(async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await CampaignService.getCampaignById(id);
      setCurrentCampaign(data);
      return data;
    } catch (err: any) {
      setError(err.message || `Không thể tải chiến dịch #${id}.`);
      setCurrentCampaign(null); // Đảm bảo currentCampaign là null nếu không tìm thấy
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCampaign = useCallback(
    async (campaignData: CreateCampaignDTO, imageFile?: File) => {
      setLoading(true);
      setError(null);
      try {
        const newCampaign = await CampaignService.createCampaign(
          campaignData,
          imageFile
        );
        setCampaigns((prev) => [...prev, newCampaign]);
        return newCampaign;
      } catch (err: any) {
        setError(err.message || "Không thể tạo chiến dịch.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateCampaign = useCallback(
    async (id: string | number, updateData: UpdateCampaignDTO) => {
      setLoading(true);
      setError(null);
      try {
        const updatedCampaign = await CampaignService.updateCampaign(
          id,
          updateData
        );
        if (currentCampaign && currentCampaign.id === updatedCampaign.id) {
          setCurrentCampaign(updatedCampaign);
        }
        setCampaigns((prev) =>
          prev.map((campaign) =>
            campaign.id === updatedCampaign.id ? updatedCampaign : campaign
          )
        );
        return updatedCampaign;
      } catch (err: any) {
        setError(err.message || `Không thể cập nhật chiến dịch #${id}.`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentCampaign]
  );

  const deleteCampaign = useCallback(
    async (id: string | number) => {
      setLoading(true);
      setError(null);
      try {
        await CampaignService.deleteCampaign(id);
        setCampaigns((prev) =>
          prev.filter((campaign) => campaign.id !== Number(id))
        );
        if (currentCampaign && currentCampaign.id === Number(id)) {
          setCurrentCampaign(null);
        }
        return true;
      } catch (err: any) {
        setError(err.message || `Không thể xóa chiến dịch #${id}.`);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [currentCampaign]
  );

  const searchCampaigns = useCallback(
    async (query: string, page: number = 1, size: number = 10) => {
      setLoading(true);
      setError(null);
      try {
        const results = await CampaignService.searchCampaigns(
          query,
          page,
          size
        );
        setSearchResults(results);
        return results;
      } catch (err: any) {
        setError(err.message || "Tìm kiếm thất bại.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const addCampaignMedia = useCallback(
    async (campaignId: string | number, file: File) => {
      setLoading(true);
      setError(null);
      try {
        const base64Image = await CampaignService.fileToBase64(file);
        const media = await CampaignService.addCampaignMedia(
          campaignId,
          base64Image
        );
        if (currentCampaign && currentCampaign.id === Number(campaignId)) {
          setCurrentCampaign({
            ...currentCampaign,
            media: [...(currentCampaign.media || []), media],
          });
        }
        return media;
      } catch (err: any) {
        setError(
          err.message || `Không thể tải hình ảnh cho chiến dịch #${campaignId}.`
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentCampaign]
  );

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    currentCampaign,
    loading,
    error,
    searchResults,
    fetchCampaigns,
    fetchCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    searchCampaigns,
    addCampaignMedia,
  };
};
