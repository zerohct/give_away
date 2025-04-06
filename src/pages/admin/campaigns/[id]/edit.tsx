// src/app/admin/campaigns/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCampaign } from "@/context/CampaignContext";
import { UpdateCampaignDTO } from "@/services/CampaignService";
import AdminLayout from "@/components/layouts/AdminLayout";
import { formatShortDate } from "@/lib/utils/dateFormatter";
import { Loader, X } from "lucide-react";

interface FormErrors {
  [key: string]: string;
}

export default function UpdateCampaignPage() {
  const router = useRouter();
  // Extract campaign ID from the URL instead of using useParams
  const [campaignId, setCampaignId] = useState<string>("");
  const {
    fetchCampaignById,
    updateCampaign,
    addCampaignMedia,
    loading,
    currentCampaign,
  } = useCampaign();
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    emoji: "",
    category: "",
    location: "",
    tags: [] as string[],
    targetAmount: 0,
    isFeatured: false,
    startDate: new Date(),
    deadline: null as Date | null,
    slug: "",
  });

  // Extract the campaign ID from the URL when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const pathParts = path.split("/");
      // Extract the ID from the URL path (e.g., /admin/campaigns/3/edit)
      const id = pathParts[pathParts.indexOf("campaigns") + 1];
      if (id) {
        setCampaignId(id);
      } else {
        console.error("Campaign ID could not be extracted from URL");
        router.push("/admin/campaigns");
      }
    }
  }, [router]);

  useEffect(() => {
    const loadCampaign = async () => {
      if (!campaignId) {
        return; // Wait until campaignId is set
      }

      setIsLoading(true);
      try {
        const campaign = await fetchCampaignById(campaignId);
        if (campaign) {
          setFormData({
            title: campaign.title || "",
            description: campaign.description || "",
            emoji: campaign.emoji || "",
            category: campaign.category || "",
            location: campaign.location || "",
            tags: Array.isArray(campaign.tags)
              ? campaign.tags
              : typeof campaign.tags === "string"
              ? JSON.parse(campaign.tags)
              : [],
            targetAmount: campaign.targetAmount || 0,
            isFeatured: campaign.isFeatured || false,
            startDate: campaign.startDate
              ? new Date(campaign.startDate)
              : new Date(),
            deadline: campaign.deadline ? new Date(campaign.deadline) : null,
            slug: campaign.slug || "",
          });

          // Set image preview if available
          if (campaign.media && campaign.media.length > 0) {
            setImagePreview(campaign.media[0].url);
          }
        }
      } catch (error) {
        console.error("Failed to load campaign:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaign();
  }, [campaignId, fetchCampaignById, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error for this field if exists
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setFormData({
      ...formData,
      [field]: date,
    });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title || formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (formData.targetAmount <= 0) {
      newErrors.targetAmount = "Target amount must be positive";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const campaignDto: UpdateCampaignDTO = {
        ...formData,
        startDate: formData.startDate
          ? formData.startDate.toISOString()
          : undefined,
        deadline: formData.deadline
          ? formData.deadline.toISOString()
          : undefined,
        tags: formData.tags || [],
      };

      if (!campaignId) {
        console.error("Cannot update: Campaign ID is missing");
        return;
      }

      const updatedCampaign = await updateCampaign(campaignId, campaignDto);
      if (updatedCampaign) {
        // Handle image upload if there's a new image
        if (imageFile && currentCampaign) {
          await addCampaignMedia(currentCampaign.id, imageFile);
        }
        router.push("/admin/campaigns");
      }
    } catch (error) {
      console.error("Failed to update campaign:", error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-4 flex justify-center items-center h-64">
          <Loader className="animate-spin mr-2" />
          <span>Loading campaign data...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Update Campaign</h1>
            <p className="text-gray-500">
              Update the details of your fundraising campaign
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Campaign title"
                    className={`w-full p-2 border rounded-md ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your campaign"
                    className="w-full p-2 border border-gray-300 rounded-md h-32 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Target Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount || ""}
                    onChange={handleInputChange}
                    placeholder="Target amount"
                    className={`w-full p-2 border rounded-md ${
                      errors.targetAmount ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.targetAmount && (
                    <p className="text-red-500 text-sm">
                      {errors.targetAmount}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Campaign category"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Campaign location"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Emoji</label>
                  <input
                    type="text"
                    name="emoji"
                    value={formData.emoji}
                    onChange={handleInputChange}
                    placeholder="Campaign emoji"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="campaign-slug"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-gray-500 text-sm">
                    URL-friendly version of the campaign name
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={
                      formData.startDate
                        ? formData.startDate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => handleDateChange(e, "startDate")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  {formData.startDate && (
                    <p className="text-gray-500 text-sm">
                      {formatShortDate(formData.startDate)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Deadline</label>
                  <input
                    type="date"
                    value={
                      formData.deadline
                        ? formData.deadline.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => handleDateChange(e, "deadline")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  {formData.deadline && (
                    <p className="text-gray-500 text-sm">
                      {formatShortDate(formData.deadline)}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 mt-4 p-3 border border-gray-300 rounded-lg">
                  <div className="flex-1">
                    <label className="font-medium">Featured Campaign</label>
                    <p className="text-gray-500 text-sm">
                      Display this campaign on the homepage
                    </p>
                  </div>
                  <div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleCheckboxChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-11 h-6 rounded-full transition-colors ${
                          formData.isFeatured ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                            formData.isFeatured
                              ? "translate-x-5"
                              : "translate-x-1"
                          }`}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags"
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Add Tag
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Campaign Image
              </label>
              <div className="flex flex-col items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {imagePreview && (
                  <div className="mt-2 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/admin/campaigns")}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
              >
                {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Update Campaign
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
