"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import { createEvent } from "@/utils/supabase/admin";

export default function CreateEventClient({ user }: { user: User | null }) {
  const router = useRouter();
  const supabase = createClient();
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [personalizedCode, setPersonalizedCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const authUser = user;
    // const { data, error } = await supabase.from("events").insert([
    //   {
    //     name: eventName,
    //     description,
    //     code: personalizedCode,
    //     start_date: startDate,
    //     end_date: endDate,
    //     host_id: authUser.id,
    //   },
    // ]);
    const createdEvent = await createEvent({
      name: eventName,
      description,
      code: personalizedCode,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userId: authUser.id,
    });

    console.log(createdEvent);
    // router.push(createdEvent.id);
    // if (error) {
    //   console.error(error);
    // } else {
    //   router.push("/dashboard");
    // }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Personalized Code</label>
          <input
            type="text"
            value={personalizedCode}
            onChange={(e) => setPersonalizedCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Date and Time</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Date and Time</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}
