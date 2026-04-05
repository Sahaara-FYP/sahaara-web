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
              className="flex items-center justify-center p-3"
            >
              {type === "image" ? (
                // 🖼 Clickable image with hover zoom
                <a href={item} target="_blank" rel="noopener noreferrer">
                  <img
                    src={item}
                    alt={`Attachment ${i + 1}`}
                    className="h-44 w-auto rounded-2xl object-cover border border-white/10 shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer ring-1 ring-white/5"
                  />
                </a>
              ) : type === "video" ? (
                // 🎥 Video preview
                <video
                  src={item}
                  controls
                  className="h-44 w-auto rounded-2xl border border-white/10 shadow-2xl bg-black/40 backdrop-blur-md"
                />
              ) : type === "audio" ? (
                // 🎧 Audio player
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 w-full shadow-xl backdrop-blur-sm shadow-black/20">
                  <audio
                    src={item}
                    controls
                    className="w-full h-10 invert brightness-200 contrast-200"
                  />
                </div>
              ) : (
                // 📄 Unknown file type fallback
                <a
                  href={item}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 px-6 py-3 rounded-xl border border-white/10 text-indigo-400 font-bold text-sm tracking-wide hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
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
