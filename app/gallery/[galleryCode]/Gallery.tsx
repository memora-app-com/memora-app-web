import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deletePhotos } from "@/utils/supabase/mutations";

const Gallery = (props: {
  photos;
  title: string;
  isPersonalMode?: boolean;
  isHost?: boolean;
}) => {
  const [photos, setPhotos] = useState(props.photos);
  const title = props.title;
  const isPersonalMode = props.isPersonalMode || false;
  const isHost = props.isHost || false;

  const [showPreview, setShowPreview] = useState(false);
  const [showPreviewIndex, setShowPreviewIndex] = useState(0);
  const showPreviewRef = useRef(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);

  // Prevent right click
  useEffect(() => {
    const handleContextmenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextmenu);
    return function cleanup() {
      document.removeEventListener("contextmenu", handleContextmenu);
    };
  }, []);

  // Close the preview when clicking outside
  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!showPreviewRef.current?.contains(event.target)) {
        setShowPreview(false);
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [showPreviewRef]);

  function handleImageClick(
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
    index: number
  ): void {
    event.preventDefault();

    setShowPreviewIndex(index);
    console.log(event);
    setShowPreview(!showPreview);
  }

  async function handleDelete(): Promise<void> {
    await deletePhotos({ photos: [photoToDelete] });
    setPhotos(photos.filter((photo) => photo.id !== photoToDelete.id));
    setIsDeleteDialogOpen(false);
  }

  function handleDeleteDialogChange(): void {
    setIsDeleteDialogOpen(!isDeleteDialogOpen);
  }

  return (
    <div>
      <h2 className="text-xl my-4 text-budge">{title}</h2>
      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent className="sm:max-w-[350px] ">
          <DialogHeader>
            <DialogTitle>Delete image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end">
            <Button onClick={handleDeleteDialogChange} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="masonry sm:masonry-sm md:masonry-md lg:masonry-lg 2xl:masonry-2xl 3xl:masonry-3xl">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="mb-2 break-inside hover:scale-105 transition-all duration-300 relative z-0"
          >
            <Image
              src={photo.url}
              width={500}
              height={500}
              alt="Event photo (error)"
              className="w-full h-full object-cover"
              loading="lazy"
              onClick={(e) => handleImageClick(e, photos.indexOf(photo))}
            />
            {(isPersonalMode || isHost) && (
              <>
                <div className="absolute right-0 bottom-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        className=" flex z-10 bg-radial-gradient-to-transparent text-white hover:bg-transparent hover:text-accent hover:scale-75 transition-all duration-300"
                        onClick={handleDeleteDialogChange}
                        variant="ghost-destructive"
                      >
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="">
                      <DropdownMenuItem
                        onClick={() => {
                          handleDeleteDialogChange();
                          setPhotoToDelete(photo);
                        }}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {showPreview && (
        <div
          className={`fixed top-0 left-0 w-full h-full flex items-center justify-center 
        bg-foreground/80 backdrop-blur-sm text-white text-2xl z-50
        font-bold cursor-pointer transition-all duration-300`}
        >
          <Carousel
            className="w-full max-w-5xl opacity-100"
            ref={showPreviewRef}
            opts={{
              startIndex: showPreviewIndex,
            }}
          >
            <CarouselContent>
              {photos.map((image, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={image.url}
                    alt="Error while loading image"
                    width={2000}
                    height={2000}
                    loading="lazy"
                    className="w-full h-full object-contain max-h-[60vh]" // Ensures the full image is visible
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute left-[2%] lg:left-[5%] top-1/2 transform -translate-y-1/2 text-4xl" />

            <CarouselNext className="absolute right-[2%] lg:right-[5%] top-1/2 transform -translate-y-1/2 text-4xl" />
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default Gallery;
