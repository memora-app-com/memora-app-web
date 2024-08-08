"use server";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function EventDetails({
  params,
}: {
  params: { eventCode: string };
}) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  return <div>Event Id: {params.eventCode}</div>;

  // const router = useRouter();
  // const { id } = router.query;
  // const [event, setEvent] = useState(null);
  // const [photos, setPhotos] = useState([]);
  // const [newPhoto, setNewPhoto] = useState(null);

  // useEffect(() => {
  //   if (params.eventId) {
  //     const fetchEvent = async () => {
  //       const { data, error } = await supabase
  //         .from("events")
  //         .select("*")
  //         .eq("id", params.eventId)
  //         .single();

  //       if (data) {
  //         setEvent(data);
  //       } else {
  //         console.error(error);
  //       }
  //     };

  //     const fetchPhotos = async () => {
  //       const { data, error } = await supabase
  //         .from("photos")
  //         .select("*")
  //         .eq("event_id", params.eventId);

  //       if (data) {
  //         setPhotos(data);
  //       } else {
  //         console.error(error);
  //       }
  //     };

  //     fetchEvent();
  //     fetchPhotos();
  //   }
  // }, [id]);

  // const handlePhotoUpload = async (e) => {
  //   e.preventDefault();
  //   if (!newPhoto) return;

  //   const file = newPhoto;

  //   const { data, error } = await supabase.storage
  //     .from("photos")
  //     .upload(`public/${id}/${file.name}`, file);

  //   if (data) {
  //     await supabase.from("photos").insert([{ event_id: id, path: data.path }]);

  //     // Refresh photos
  //     const { data: newPhotos } = await supabase
  //       .from("photos")
  //       .select("*")
  //       .eq("event_id", id);

  //     setPhotos(newPhotos);
  //     setNewPhoto(null); // Clear the file input
  //   } else {
  //     console.error(error);
  //   }
  // };

  // return (
  //   <div className="container mx-auto p-4">
  //     {event && (
  //       <div className="mb-8">
  //         <h1 className="text-3xl font-bold">{event.name}</h1>
  //         <p className="text-gray-600">
  //           {new Date(event.date).toLocaleDateString()}
  //         </p>
  //         <p className="text-gray-800 mt-4">{event.description}</p>
  //       </div>
  //     )}

  //     <div className="mb-8">
  //       <h2 className="text-2xl font-bold">Upload Photo</h2>
  //       <form onSubmit={handlePhotoUpload} className="mt-4">
  //         <input
  //           type="file"
  //           onChange={(e) => setNewPhoto(e.target.files[0])}
  //           className="block w-full text-sm text-gray-500
  //           file:mr-4 file:py-2 file:px-4
  //           file:rounded-full file:border-0
  //           file:text-sm file:font-semibold
  //           file:bg-violet-50 file:text-violet-700
  //           hover:file:bg-violet-100"
  //         />
  //         <button
  //           type="submit"
  //           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
  //         >
  //           Upload
  //         </button>
  //       </form>
  //     </div>

  //     <div>
  //       <h2 className="text-2xl font-bold mb-4">Gallery</h2>
  //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  //         {photos.map((photo) => (
  //           <div
  //             key={photo.id}
  //             className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden"
  //           >
  //             <img
  //               src={`https://your-supabase-url/storage/v1/object/public/${photo.path}`}
  //               alt="Event photo"
  //               className="w-full h-full object-cover"
  //             />
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // );
}
