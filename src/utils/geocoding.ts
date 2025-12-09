// src/utils/geocoding.ts
// TypeScript helper to reverse-geocode lat/lng using OpenStreetMap Nominatim

export interface NominatimResponse {
  display_name?: string;
  // there are many other fields, but we only need display_name here
  [key: string]: any;
}

export async function getAddressFromCoords(
  lat: number,
  lng: number
): Promise<string> {
  if (lat === undefined || lng === undefined || lat === null || lng === null) {
    return "";
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
        lat
      )}&lon=${encodeURIComponent(lng)}`,
      {
        headers: {
          // Nominatim requires a valid User-Agent; replace with your app info
          "User-Agent": "SahaaraWebApp/1.0 (email@example.com)",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim error ${response.status}`);
    }

    const data: NominatimResponse = await response.json();
    return data.display_name ?? `${lat}, ${lng}`;
  } catch (err) {
    console.error("getAddressFromCoords error:", err);
    return `${lat}, ${lng}`; // fallback to coordinates
  }
}
