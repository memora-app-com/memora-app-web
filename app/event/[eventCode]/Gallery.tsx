import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Gallery = ({ photos }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showPreviewIndex, setShowPreviewIndex] = useState(0);
  const showPreviewRef = useRef(null);

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

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gallery</h2>
      {/* TODO: Work a bit with these styles */}
      {/* examples: https://flowbite.com/docs/components/gallery/ */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden"
          >
            <Image
              src={photo.url}
              width={500}
              height={500}
              alt="Event photo"
              className="w-full h-full object-cover"
              loading="lazy"
              onClick={(e) => handleImageClick(e, photos.indexOf(photo))}
            />
          </div>
        ))}
      </div>
      {showPreview && (
        <div
          className={`fixed top-0 left-0 w-full h-full flex items-center justify-center 
        bg-background/80 text-white text-2xl 
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
                    alt="Carousel photo"
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