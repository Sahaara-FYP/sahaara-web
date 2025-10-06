import { Loader2 } from "lucide-react";
import React from "react";

const LoaderOverlay = ({ message = "Loading...", show = false }) => {
  console.log("🚀 ~ LoaderOverlay ~ show:", show);
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md bg-black/30">
      {/* Spinner */}
      <Loader2 className="animate-spin" />

      {/* Optional text */}
      <p className="text-white text-lg font-medium">{message}</p>
    </div>
  );
};

export default LoaderOverlay;
