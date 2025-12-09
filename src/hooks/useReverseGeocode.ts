// src/hooks/useReverseGeocode.ts
import { useEffect, useState } from "react";
import { getAddressFromCoords } from "@/utils/geocoding";

/**
 * Simple session cache (module-level). Keeps addresses for the lifetime of the page.
 * Key: "lat,lng" -> value: address string
 */
const addressCache = new Map<string, string>();

export function useReverseGeocode(lat?: number | null, lng?: number | null) {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (
      lat === undefined ||
      lat === null ||
      lng === undefined ||
      lng === null
    ) {
      setAddress("");
      setLoading(false);
      return;
    }

    const key = `${lat},${lng}`;
    if (addressCache.has(key)) {
      setAddress(addressCache.get(key)!);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getAddressFromCoords(lat, lng)
      .then((addr) => {
        if (cancelled) return;
        addressCache.set(key, addr);
        setAddress(addr);
      })
      .catch((err) => {
        // handled in helper, still log in hook
        console.error("useReverseGeocode fetch error", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  return { address, loading };
}
