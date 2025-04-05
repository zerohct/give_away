import { useState, useEffect, useCallback } from "react";
import {
  CampaignService,
  Campaign,
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

  // Get all campaigns
  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CampaignService.getAllCampaigns();
      setCampaigns(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  }, []);

  // Get campaign by ID
  const fetchCampaignById = useCallback(async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await CampaignService.getCampaignById(id);
      setCurrentCampaign(data);
      return data;
    } catch (err: any) {
      setError(err.message || `Failed to fetch campaign #${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new campaign
  const createCampaign = useCallback(
    async (campaignData: CreateCampaignDTO, imageFile?: File) => {
      setLoading(true);
      setError(null);
      try {
        const newCampaign = await CampaignService.createCampaign(
          campaignData,
          imageFile
        );
        // Update campaigns list after creation
        setCampaigns((prev) => [...prev, newCampaign]);
        return newCampaign;
      } catch (err: any) {
        setError(err.message || "Failed to create campaign");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update campaign
  const updateCampaign = useCallback(
    async (id: string | number, updateData: UpdateCampaignDTO) => {
      setLoading(true);
      setError(null);
      try {
        const updatedCampaign = await CampaignService.updateCampaign(
          id,
          updateData
        );

        // Update current campaign if it's the one being edited
        if (currentCampaign && currentCampaign.id === updatedCampaign.id) {
          setCurrentCampaign(updatedCampaign);
        }

        // Update campaigns list
        setCampaigns((prev) =>
          prev.map((campaign) =>
            campaign.id === updatedCampaign.id ? updatedCampaign : campaign
          )
        );

        return updatedCampaign;
      } catch (err: any) {
        setError(err.message || `Failed to update campaign #${id}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentCampaign]
  );

  // Delete campaign
  const deleteCampaign = useCallback(
    async (id: string | number) => {
      setLoading(true);
      setError(null);
      try {
        await CampaignService.deleteCampaign(id);

        // Remove from campaigns list
        setCampaigns((prev) =>
          prev.filter((campaign) => campaign.id !== Number(id))
        );

        // Clear current campaign if it's the one being deleted
        if (currentCampaign && currentCampaign.id === Number(id)) {
          setCurrentCampaign(null);
        }

        return true;
      } catch (err: any) {
        setError(err.message || `Failed to delete campaign #${id}`);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [currentCampaign]
  );

  // Search campaigns
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
        setError(err.message || "Search failed");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Add media to campaign
  const addCampaignMedia = useCallback(
    async (campaignId: string | number, file: File) => {
      setLoading(true);
      setError(null);
      try {
        // Convert file to base64
        const base64Image = await CampaignService.fileToBase64(file);
        const media = await CampaignService.addCampaignMedia(
          campaignId,
          base64Image
        );

        // Update current campaign with new media if it's the one being edited
        if (currentCampaign && currentCampaign.id === Number(campaignId)) {
          setCurrentCampaign({
            ...currentCampaign,
            media: [...(currentCampaign.media || []), media],
          });
        }

        return media;
      } catch (err: any) {
        setError(
          err.message || `Failed to upload media for campaign #${campaignId}`
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentCampaign]
  );

  // Load campaigns on initial mount if needed
  useEffect(() => {
    // You can enable this if you want to load campaigns automatically
    // fetchCampaigns();
  }, []);

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
