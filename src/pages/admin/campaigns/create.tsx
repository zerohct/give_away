"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCampaign } from "@/context/CampaignContext";
import { CreateCampaignDTO } from "@/services/CampaignService";
import AdminLayout from "@/components/layouts/AdminLayout";
import { formatShortDate } from "@/lib/utils/dateFormatter";
import {
  Loader,
  X,
  Calendar,
  MapPin,
  Tag,
  Heart,
  Image as ImageIcon,
  Target,
} from "lucide-react";

interface FormErrors {
  [key: string]: string;
}

export default function CreateCampaignPage() {
  const router = useRouter();
  const { createCampaign, loading } = useCampaign();
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState<string>("basic");

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
      const campaignDto: CreateCampaignDTO = {
        ...formData,
        startDate: formData.startDate.toISOString(),
        deadline: formData.deadline?.toISOString(),
        tags: formData.tags || [],
      };

      const newCampaign = await createCampaign(
        campaignDto,
        imageFile || undefined
      );
      if (newCampaign) {
        router.push("/admin/campaigns");
      }
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
  };

  const tabs = [
    { id: "basic", label: "Campaign Basics", icon: Heart },
    { id: "details", label: "Additional Details", icon: Target },
    { id: "media", label: "Media & Tags", icon: ImageIcon },
  ];

  return (
    <AdminLayout>
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen pb-12">
        <div className="container mx-auto px-4 pt-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h1 className="text-3xl font-bold">Create New Campaign</h1>
                <p className="opacity-90 mt-2">
                  Create a campaign and inspire others to make a difference
                </p>
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-6 transition-colors ${
                      activeTab === tab.id
                        ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                        : "text-gray-500 hover:text-blue-500"
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-2" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={onSubmit} className="p-6">
                {/* Tab 1: Basic Information */}
                <div className={activeTab === "basic" ? "block" : "hidden"}>
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-500">
                      <h2 className="text-xl font-semibold text-blue-700 mb-2">
                        Campaign Basics
                      </h2>
                      <p className="text-blue-600 text-sm">
                        Start with the fundamental details to create a
                        compelling campaign
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Campaign Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Give your campaign a compelling title"
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition ${
                            errors.title ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.title && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.title}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Campaign Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Tell potential donors why this cause matters"
                          className="w-full p-3 border border-gray-300 rounded-lg h-36 resize-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Target Amount <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-gray-500">$</span>
                          </div>
                          <input
                            type="number"
                            name="targetAmount"
                            value={formData.targetAmount || ""}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            className={`w-full p-3 pl-8 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition ${
                              errors.targetAmount
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        {errors.targetAmount && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.targetAmount}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab 2: Additional Details */}
                <div className={activeTab === "details" ? "block" : "hidden"}>
                  <div className="space-y-6">
                    <div className="bg-purple-50 rounded-lg p-5 border-l-4 border-purple-500">
                      <h2 className="text-xl font-semibold text-purple-700 mb-2">
                        Campaign Details
                      </h2>
                      <p className="text-purple-600 text-sm">
                        Add context and timing information to help potential
                        donors understand your campaign
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>Location</span>
                          </div>
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Where is this campaign taking place?"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1" />
                            <span>Category</span>
                          </div>
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange as any}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition"
                        >
                          <option value="">Select a category</option>
                          <option value="Education">Education</option>
                          <option value="Medical">Medical</option>
                          <option value="Disaster">Disaster Relief</option>
                          <option value="Animals">Animals</option>
                          <option value="Environment">Environment</option>
                          <option value="Community">Community</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Start Date</span>
                          </div>
                        </label>
                        <input
                          type="date"
                          value={
                            formData.startDate
                              ? formData.startDate.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) => handleDateChange(e, "startDate")}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition"
                        />
                        {formData.startDate && (
                          <p className="text-gray-500 text-xs mt-1">
                            {formatShortDate(formData.startDate)}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>End Date</span>
                          </div>
                        </label>
                        <input
                          type="date"
                          value={
                            formData.deadline
                              ? formData.deadline.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) => handleDateChange(e, "deadline")}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition"
                        />
                        {formData.deadline && (
                          <p className="text-gray-500 text-xs mt-1">
                            {formatShortDate(formData.deadline)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Emoji
                        </label>
                        <input
                          type="text"
                          name="emoji"
                          value={formData.emoji}
                          onChange={handleInputChange}
                          placeholder="Add an emoji that represents your cause"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Campaign URL Slug
                        </label>
                        <input
                          type="text"
                          name="slug"
                          value={formData.slug}
                          onChange={handleInputChange}
                          placeholder="your-campaign-name"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition"
                        />
                        <p className="text-gray-500 text-xs mt-1">
                          This will be the URL of your campaign:
                          oursite.com/campaigns/[slug]
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 p-5 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-purple-800">
                            Feature This Campaign
                          </h3>
                          <p className="text-purple-600 text-sm">
                            Highlight this campaign on the homepage to increase
                            visibility
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleCheckboxChange}
                            className="sr-only"
                          />
                          <div
                            className={`w-12 h-6 rounded-full transition-colors ${
                              formData.isFeatured
                                ? "bg-purple-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 bg-white rounded-full transition-transform transform ${
                                formData.isFeatured
                                  ? "translate-x-6"
                                  : "translate-x-0"
                              } shadow-md`}
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab 3: Media & Tags */}
                <div className={activeTab === "media" ? "block" : "hidden"}>
                  <div className="space-y-6">
                    <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
                      <h2 className="text-xl font-semibold text-green-700 mb-2">
                        Media & Tags
                      </h2>
                      <p className="text-green-600 text-sm">
                        Add visuals and relevant tags to help your campaign
                        reach the right audience
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          Campaign Image
                        </label>
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                            imagePreview
                              ? "border-green-300 bg-green-50"
                              : "border-gray-300 hover:border-green-400"
                          }`}
                        >
                          {!imagePreview ? (
                            <div className="space-y-2">
                              <div className="flex justify-center">
                                <ImageIcon className="h-12 w-12 text-gray-400" />
                              </div>
                              <div className="text-sm text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer font-medium text-green-600 hover:text-green-500"
                                >
                                  <span>Upload an image</span>
                                  <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="sr-only"
                                  />
                                </label>
                                <p className="mt-1">or drag and drop</p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 5MB
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-h-64 mx-auto rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setImageFile(null);
                                  setImagePreview(null);
                                }}
                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-600 hover:text-red-500 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          Campaign Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {formData.tags.map((tag) => (
                            <div
                              key={tag}
                              className="bg-gradient-to-r from-green-100 to-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="text-blue-600 hover:text-red-500 ml-1 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Add relevant tags (e.g. education, children)"
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(), addTag())
                            }
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 transition"
                          />
                          <button
                            type="button"
                            onClick={addTag}
                            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 border border-green-200 transition-colors font-medium"
                          >
                            Add Tag
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => router.push("/admin/campaigns")}
                      className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>

                    <div className="flex gap-3">
                      {activeTab !== "basic" && (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveTab(
                              tabs[
                                tabs.findIndex((t) => t.id === activeTab) - 1
                              ].id
                            )
                          }
                          className="px-5 py-2.5 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          Previous
                        </button>
                      )}

                      {activeTab !== "media" ? (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveTab(
                              tabs[
                                tabs.findIndex((t) => t.id === activeTab) + 1
                              ].id
                            )
                          }
                          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Continue
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-70 flex items-center gap-2 shadow-md"
                        >
                          {loading && (
                            <Loader className="h-4 w-4 animate-spin" />
                          )}
                          Launch Campaign
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
