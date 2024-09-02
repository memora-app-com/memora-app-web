"use client";

import React, { useEffect, useRef, useState } from "react";

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
import { toast } from "sonner";
import MultipleImageUploader from "./MultipleImageUploader";
import { createPhotos, deletePhotoObjects } from "@/utils/supabase/mutations";
import { UploadedFile } from "./UploadedFile";
import Gallery from "./Gallery";
import { Clipboard, ClipboardCheck, Share2 } from "lucide-react";
import { useQRCode } from "next-qrcode";

export default function EventDetails({
  params,
}: {
  params: { eventCode: string };
}) {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const { authUser, authLoading, authError } = useAuthUser();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const { Canvas } = useQRCode();

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
    setIsUploadDialogOpen(false);
    setIsSaveLoading(false);
  }

  function handleUploadDialogChange(open: boolean): void {
    setIsUploadDialogOpen(open);
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

  function handleInviteDialogChange(open: boolean): void {
    setIsInviteDialogOpen(open);
  }

  function getInviteLink(): string {
    return `${window.location.origin
      .replace("https://", "")
      .replace("http://", "")}/join-event?code=${event.code}`;
  }

  function handleCopyInviteLink(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
    navigator.clipboard.writeText(getInviteLink());
    toast("Copied to clipboard", {
      description: "The link has been copied to your clipboard",
    });
    setIsLinkCopied(true);
  }

  return (
    <div className=" p-4">
      {authLoading || isLoading ? (
        <LoadingIcon center />
      ) : (
        <div className="mb-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              {event.name !== "" ? event.name : "Joined event"}
            </h1>
          </div>

          <Dialog
            open={isInviteDialogOpen}
            onOpenChange={handleInviteDialogChange}
          >
            <DialogTrigger asChild>
              <div className="text-center">
                <Button variant="ghost" className="">
                  <p className="text-sm text-muted-foreground ">
                    # {event.code}{" "}
                  </p>
                  <Share2 size={20} className="text-muted-foreground ml-2" />
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Invite your friends</DialogTitle>
                <DialogDescription>
                  Share the event code with your friends to invite them to the
                  event.
                </DialogDescription>
              </DialogHeader>
              <div className="text-center">
                <Button
                  variant="ghost"
                  className="mb-4"
                  onClick={handleCopyInviteLink}
                >
                  <p className="text-sm">{getInviteLink()}</p>
                  {isLinkCopied ? (
                    <ClipboardCheck
                      size={20}
                      className="text-muted-foreground ml-2"
                    />
                  ) : (
                    <Clipboard
                      size={20}
                      className="text-muted-foreground ml-2"
                    />
                  )}
                </Button>
                <div className="flex items-center justify-center">
                  <Canvas
                    text={getInviteLink()}
                    options={{
                      errorCorrectionLevel: "M",
                      margin: 3,
                      scale: 4,
                      width: 200,
                    }}
                  />
                </div>
                <p className="font-bold mt-4">Join code: #{event.code}</p>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isUploadDialogOpen}
            onOpenChange={handleUploadDialogChange}
          >
            <DialogTrigger asChild>
              <div className="text-center">
                <Button className="mt-4">Upload photos</Button>
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

          <Gallery photos={photos} />
        </div>
      )}
    </div>
  );
}
