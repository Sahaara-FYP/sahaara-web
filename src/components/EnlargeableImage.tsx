import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

export const EnlargeableImage = ({
  src,
  alt = "Image",
  className = "",
}: {
  src: string;
  alt?: string;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className} cursor-pointer transition-transform duration-200 hover:scale-105`}
        onClick={() => setIsOpen(true)}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] md:max-w-3xl border-none bg-transparent shadow-none p-0 flex justify-center items-center [&>button]:text-white [&>button]:bg-black/50 [&>button]:rounded-full [&>button]:p-1">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          <img
            src={src}
            alt={alt}
            className="w-auto h-auto max-h-[85vh] max-w-full object-contain rounded-md"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
