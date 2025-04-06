// // src/app/admin/campaigns/view/[id]/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { useCampaign } from "@/context/CampaignContext";
// import AdminLayout from "@/components/layouts/AdminLayout";
// import { formatShortDate } from "@/lib/utils/dateFormatter";
// import { formatCurrency } from "@/lib/utils/format";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   Edit,
//   Trash,
//   Loader,
//   Calendar,
//   MapPin,
//   Tag,
//   DollarSign,
//   Pencil,
// } from "lucide-react";

// export default function CampaignDetailPage() {
//   const router = useRouter();
//   const params = useParams();
//   const campaignId = params.id as string;
//   const { fetchCampaignById, deleteCampaign, currentCampaign, loading } =
//     useCampaign();
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

//   useEffect(() => {
//     const loadCampaign = async () => {
//       await fetchCampaignById(campaignId);
//     };

//     loadCampaign();
//   }, [campaignId, fetchCampaignById]);

//   const handleDelete = async () => {
//     if (currentCampaign) {
//       const success = await deleteCampaign(currentCampaign.id);
//       if (success) {
//         router.push("/admin/campaigns");
//       }
//     }
//     setIsDeleteDialogOpen(false);
//   };

//   const calculateProgress = () => {
//     if (!currentCampaign || currentCampaign.targetAmount === 0) return 0;
//     const percentage =
//       (currentCampaign.collectedAmount / currentCampaign.targetAmount) * 100;
//     return Math.min(percentage, 100);
//   };

//   const renderTagBadges = () => {
//     if (!currentCampaign || !currentCampaign.tags) return null;

//     let tags = currentCampaign.tags;
//     if (typeof tags === "string") {
//       try {
//         tags = JSON.parse(tags);
//       } catch {
//         tags = [tags];
//       }
//     }

//     if (!Array.isArray(tags)) return null;

//     return tags.map((tag, index) => (
//       <span
//         key={index}
//         className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
//       >
//         {tag}
//       </span>
//     ));
//   };

//   if (loading) {
//     return (
//       <AdminLayout>
//         <div className="container mx-auto p-4 flex justify-center items-center h-64">
//           <Loader className="animate-spin mr-2" />
//           <span>Loading campaign details...</span>
//         </div>
//       </AdminLayout>
//     );
//   }

//   if (!currentCampaign) {
//     return (
//       <AdminLayout>
//         <div className="container mx-auto p-4">
//           <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
//             <div className="text-center py-8">
//               <h1 className="text-2xl font-bold text-gray-700">
//                 Campaign Not Found
//               </h1>
//               <p className="text-gray-500 mt-2">
//                 The campaign you're looking for doesn't exist or has been
//                 removed.
//               </p>
//               <button
//                 onClick={() => router.push("/admin/campaigns")}
//                 className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//               >
//                 Go Back to Campaigns
//               </button>
//             </div>
//           </div>
//         </div>
//       </AdminLayout>
//     );
//   }

//   return (
//     <AdminLayout>
//       <div className="container mx-auto p-4">
//         <div className="mb-4">
//           <button
//             onClick={() => router.push("/admin/campaigns")}
//             className="flex items-center text-blue-600 hover:text-blue-800"
//           >
//             <ArrowLeft size={16} className="mr-1" /> Back to Campaigns
//           </button>
//         </div>

//         <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
//           {/* Campaign Header */}
//           <div className="relative">
//             {currentCampaign.media && currentCampaign.media.length > 0 ? (
//               <img
//                 src={currentCampaign.media[0].url}
//                 alt={currentCampaign.title}
//                 className="w-full h-64 object-cover"
//               />
//             ) : (
//               <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
//                 <Pencil size={48} className="text-gray-400" />
//                 <span className="ml-2 text-gray-500">No image available</span>
//               </div>
//             )}

//             {currentCampaign.isFeatured && (
//               <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
//                 Featured
//               </div>
//             )}

//             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
//               <div className="text-white">
//                 <div className="flex items-center mb-2">
//                   <span className="text-2xl mr-2">
//                     {currentCampaign.emoji || "🎯"}
//                   </span>
//                   <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded capitalize">
//                     {currentCampaign.status || "active"}
//                   </span>
//                 </div>
//                 <h1 className="text-3xl font-bold">{currentCampaign.title}</h1>
//               </div>
//             </div>
//           </div>

//           {/* Campaign Content */}
//           <div className="p-6">
//             <div className="flex flex-wrap justify-between mb-6">
//               <div className="mb-4 md:mb-0">
//                 <div className="flex items-center text-gray-600 mb-2">
//                   <Calendar size={16} className="mr-2" />
//                   <span>
//                     Created: {formatShortDate(currentCampaign.createdAt)}
//                   </span>
//                 </div>
//                 {currentCampaign.location && (
//                   <div className="flex items-center text-gray-600 mb-2">
//                     <MapPin size={16} className="mr-2" />
//                     <span>{currentCampaign.location}</span>
//                   </div>
//                 )}
//                 {currentCampaign.category && (
//                   <div className="flex items-center text-gray-600">
//                     <Tag size={16} className="mr-2" />
//                     <span>{currentCampaign.category}</span>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <div className="text-gray-600 mb-1">Campaign Dates</div>
//                 <div className="flex flex-wrap gap-4">
//                   <div>
//                     <div className="text-sm text-gray-500">Start Date</div>
//                     <div className="font-medium">
//                       {currentCampaign.startDate
//                         ? formatShortDate(currentCampaign.startDate)
//                         : "Not set"}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-gray-500">Deadline</div>
//                     <div className="font-medium">
//                       {currentCampaign.deadline
//                         ? formatShortDate(currentCampaign.deadline)
//                         : "No deadline"}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Funding Progress */}
//             <div className="bg-gray-100 p-4 rounded-lg mb-6">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <div className="text-sm text-gray-500">Target</div>
//                   <div className="text-xl font-bold text-gray-900">
//                     {formatCurrency(currentCampaign.targetAmount)}
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-gray-500">Collected</div>
//                   <div className="text-xl font-bold text-green-600">
//                     {formatCurrency(currentCampaign.collectedAmount || 0)}
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-gray-500">Progress</div>
//                   <div className="text-xl font-bold text-blue-600">
//                     {calculateProgress().toFixed(1)}%
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-3">
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div
//                     className="bg-blue-600 h-2.5 rounded-full"
//                     style={{ width: `${calculateProgress()}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             {/* Description */}
//             <div className="mb-6">
//               <h2 className="text-xl font-semibold mb-2">Description</h2>
//               <div className="text-gray-700 whitespace-pre-line">
//                 {currentCampaign.description || "No description provided."}
//               </div>
//             </div>

//             {/* Tags */}
//             {currentCampaign.tags && currentCampaign.tags.length > 0 && (
//               <div className="mb-6">
//                 <h2 className="text-xl font-semibold mb-2">Tags</h2>
//                 <div className="flex flex-wrap gap-2">{renderTagBadges()}</div>
//               </div>
//             )}

//             {/* Additional Info */}
//             <div className="border-t border-gray-200 pt-6 mt-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <div className="text-sm text-gray-500">Campaign ID</div>
//                   <div className="font-medium">{currentCampaign.id}</div>
//                 </div>
//                 {currentCampaign.slug && (
//                   <div>
//                     <div className="text-sm text-gray-500">Slug</div>
//                     <div className="font-medium">{currentCampaign.slug}</div>
//                   </div>
//                 )}
//                 <div>
//                   <div className="text-sm text-gray-500">Last Updated</div>
//                   <div className="font-medium">
//                     {formatShortDate(currentCampaign.updatedAt)}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end gap-4 mt-8">
//               <Link href={`/admin/campaigns/edit/${currentCampaign.id}`}>
//                 <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
//                   <Edit size={16} className="mr-2" /> Edit Campaign
//                 </button>
//               </Link>
//               <button
//                 onClick={() => setIsDeleteDialogOpen(true)}
//                 className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//               >
//                 <Trash size={16} className="mr-2" /> Delete
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Delete Confirmation Dialog */}
//         {isDeleteDialogOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 max-w-md w-full">
//               <div className="mb-4">
//                 <h3 className="text-lg font-medium">Are you sure?</h3>
//                 <p className="text-gray-500 mt-2">
//                   This action cannot be undone. This will permanently delete the
//                   campaign "{currentCampaign.title}" and all related data.
//                 </p>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   onClick={() => setIsDeleteDialogOpen(false)}
//                   className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// }
