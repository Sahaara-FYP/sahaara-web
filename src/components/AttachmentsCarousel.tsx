import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function AttachmentsCarousel({
  attachments,
}: {
  attachments: string[];
}) {
  if (!attachments?.length) return null;

  // helper to detect file type
  const getFileType = (url: string) => {
    const cleanUrl = url.split("?")[0]; // remove query params
    const ext = cleanUrl.split(".").pop()?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["mp4", "mov", "webm", "mkv"].includes(ext)) return "video";
    if (["mp3", "wav", "m4a", "ogg"].includes(ext)) return "audio";
    return "unknown";
  };

  return (
    <Carousel className="w-full max-w-xs mx-auto">
      <CarouselContent>
        {attachments.map((item, i) => {
          const type = getFileType(item);

          return (
            <CarouselItem
              key={i}
              className="flex items-center justify-center p-2"
            >
              {type === "image" ? (
                // 🖼 Clickable image with hover zoom
                <a href={item} target="_blank" rel="noopener noreferrer">
                  <img
                    src={item}
                    alt={`Attachment ${i + 1}`}
                    className="h-40 w-auto rounded-lg object-cover border shadow-sm transition-transform duration-200 hover:scale-105 cursor-pointer"
                  />
                </a>
              ) : type === "video" ? (
                // 🎥 Video preview
                <video
                  src={item}
                  controls
                  className="h-40 w-auto rounded-lg border shadow-sm bg-black"
                />
              ) : type === "audio" ? (
                // 🎧 Audio player
                <audio src={item} controls className="w-full/2 " />
              ) : (
                // 📄 Unknown file type fallback
                <a
                  href={item}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  View Attachment {i + 1}
                </a>
              )}
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
