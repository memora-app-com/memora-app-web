"use client";

import React, { useEffect, useRef, useState } from "react";

import useAuthUser from "@/hooks/useUser";
import { fetchGallery, fetchPhotos } from "@/utils/supabase/queries";

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
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import H1 from "@/components/H1";

export default function GalleryPage({
  params,
}: {
  params: { galleryCode: string };
}) {
  const [gallery, setGallery] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const { authUser, authLoading, authError } = useAuthUser();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const router = useRouter();
  const { Canvas } = useQRCode();

  useEffect(() => {
    async function fetchData() {
      if (params.galleryCode) {
        if (!authUser) {
          router.push("/join?code=" + params.galleryCode);
          return;
        }
        const fetchedGallery = await fetchGallery(params.galleryCode);

        if (!fetchedGallery) {
          setIsLoading(false);
          window.location.href = "/error";
          return;
        }

        setGallery(fetchedGallery);

        const fetchedPhotos = await fetchPhotos(fetchedGallery.id);
        setPhotos(fetchedPhotos);
      }

      setIsLoading(false);
    }

    if (!authLoading) {
      console.log("finished loading");
      fetchData();
    }
  }, [params.galleryCode, authLoading]);

  async function handleSubmit(
    e: MouseEvent | React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    setIsSaveLoading(true);
    e.preventDefault();

    const photosToCreate = uploadedFiles.map((file) => ({
      galleryId: gallery.id,
      userId: authUser.id,
      url: file.url,
    }));

    await createPhotos(photosToCreate);
    setIsUploadDialogOpen(false);
    setIsSaveLoading(false);

    setPhotos([...photos, ...photosToCreate]);
    //this doesn't work
    // router.refresh();
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
      .replace("http://", "")}/join?code=${gallery.code}`;
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
    <>
      {authUser && !authUser.is_anonymous && <Navbar />}
      <div className=" p-4">
        {authLoading || isLoading ? (
          <LoadingIcon center />
        ) : (
          <div className="mb-4">
            <div className="text-center">
              <H1 className="mb-0">
                {gallery.title !== "" ? gallery.title : "Joined gallery"}
              </H1>
            </div>

            <Dialog
              open={isInviteDialogOpen}
              onOpenChange={handleInviteDialogChange}
            >
              <div className="text-center">
                <DialogTrigger asChild>
                  <Button variant="ghost">
                    <p className="text-sm text-muted-foreground ">
                      # {gallery.code}{" "}
                    </p>
                    <Share2 size={20} className="text-muted-foreground ml-2" />
                  </Button>
                </DialogTrigger>
              </div>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    <H1 className="mb-0">Invite your friends</H1>
                  </DialogTitle>
                  <DialogDescription>
                    Share the gallery code with your friends to invite them to
                    the gallery.
                  </DialogDescription>
                </DialogHeader>
                <div className="text-center">
                  <p className=" mb-4 overflow-hidden">
                    Join code:
                    <strong>
                      <br /> {gallery.code}
                    </strong>
                  </p>

                  <div className="flex items-center justify-center">
                    <Canvas
                      text={getInviteLink()}
                      options={{
                        errorCorrectionLevel: "M",
                        margin: 3,
                        scale: 4,
                        width: 200,
                        color: { dark: "#000000", light: "#fefaf1" },
                      }}
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={handleCopyInviteLink}
                  >
                    <p className="text-sm ">Copy Link</p>
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
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isUploadDialogOpen}
              onOpenChange={handleUploadDialogChange}
            >
              <div className="text-center">
                <DialogTrigger asChild>
                  <Button className="mt-2">Upload photos</Button>
                </DialogTrigger>
              </div>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Upload your photos</DialogTitle>
                  <DialogDescription>
                    Upload photos here. Wait for them to load, then click save
                    when you&rsquo;re done.
                  </DialogDescription>
                </DialogHeader>

                <MultipleImageUploader
                  galleryId={gallery.id}
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
    </>
  );
}
