"use client";

import { useEffect, useState } from "react";

import useAuthUser from "@/hooks/useUser";
import { fetchEvent, fetchPhotos } from "@/utils/supabase/queries";

import { LoadingIcon } from "@/components/LoadingIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import MultipleImageUploader from "./MultipleImageUploader";
import { createPhotos, deletePhotoObjects } from "@/utils/supabase/mutations";
import { UploadedFile } from "./UploadedFile";
import Image from "next/image";

export default function EventDetails({
  params,
}: {
  params: { eventCode: string };
}) {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [newPhoto, setNewPhoto] = useState(null);
  const { authUser, authLoading, authError } = useAuthUser();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      if (params.eventCode) {
        const eventCode = params.eventCode;
        const retrivedEvent = await fetchEvent(eventCode);
        setEvent(retrivedEvent);

        const retrivedPhotos = await fetchPhotos(retrivedEvent.id);
        setPhotos(retrivedPhotos);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [params.eventCode]);

  function handleSubmit(
    e: MouseEvent | React.MouseEvent<HTMLButtonElement>
  ): void {
    setIsSaveLoading(true);
    e.preventDefault();

    const photos = uploadedFiles.map((file) => ({
      eventId: event.id,
      userId: authUser.id,
      url: file.url,
    }));

    createPhotos(photos);
    setIsDialogOpen(false);
    setIsSaveLoading(false);
  }

  function handleDialogChange(open: boolean): void {
    setIsDialogOpen(open);
    const photoUrls = [];
    if (!open) {
      uploadedFiles.forEach((file) => {
        if (file.status === "uploaded") {
          photoUrls.push(file.url);
        }
      });

      if (photoUrls.length > 0) {
        deletePhotoObjects({
          urls: photoUrls,
        });
      }

      setUploadedFiles([]);
    }
  }

  return (
    <div className="container p-4">
      {authLoading || isLoading ? (
        <LoadingIcon />
      ) : (
        <div className="mb-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              {event.name !== "" ? event.name : "Joined event"}
            </h1>
            <p className="text-sm text-muted-foreground "># {event.code}</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <div className="text-center">
                <Button className="mt-8">Upload photos</Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload your photos</DialogTitle>
                <DialogDescription>
                  Upload photos here. Wait for them to load, then click save
                  when you&rsquo;re done.
                </DialogDescription>
              </DialogHeader>

              <MultipleImageUploader
                eventId={event.id}
                userId={authUser.id}
                setUploadedFiles={setUploadedFiles}
              />

              <DialogFooter>
                <Button
                  onClick={handleSubmit}
                  type="submit"
                  disabled={uploadedFiles.length === 0}
                >
                  {isSaveLoading ? <LoadingIcon /> : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div>
            <h2 className="text-xl font-bold mb-4">Gallery</h2>
            {/* TODO: Work a bit with these styles */}
            {/* examples: https://flowbite.com/docs/components/gallery/ */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden"
                >
                  <Image
                    src={photo.url}
                    alt="Event photo"
                    className="w-full h-full object-cover"
                    // className="h-auto max-w-full rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
