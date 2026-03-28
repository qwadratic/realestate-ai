import type { PlaceResult } from "@/types";

const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;
const BASE_URL = "https://places.googleapis.com/v1/places:searchNearby";
const ROUTES_URL = "https://routes.googleapis.com/directions/v2:computeRoutes";

interface LatLng {
  lat: number;
  lng: number;
}

async function geocodeAddress(address: string): Promise<LatLng | null> {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${MAPS_API_KEY}`
    );
    const data = await res.json();
    if (data.results?.[0]?.geometry?.location) {
      return data.results[0].geometry.location;
    }
    return null;
  } catch {
    return null;
  }
}

async function searchNearby(
  location: LatLng,
  type: string,
  radius: number = 1000
): Promise<PlaceResult[]> {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": MAPS_API_KEY,
        "X-Goog-FieldMask":
          "places.displayName,places.shortFormattedAddress,places.rating,places.location",
      },
      body: JSON.stringify({
        includedTypes: [type],
        maxResultCount: 5,
        locationRestriction: {
          circle: {
            center: { latitude: location.lat, longitude: location.lng },
            radius,
          },
        },
      }),
    });
    const data = await res.json();
    if (!data.places) return [];

    return data.places.map((p: Record<string, unknown>) => {
      const placeLocation = p.location as { latitude: number; longitude: number } | undefined;
      const dist = placeLocation
        ? haversineDistance(location, {
            lat: placeLocation.latitude,
            lng: placeLocation.longitude,
          })
        : 0;
      return {
        name: (p.displayName as { text: string })?.text || "Unknown",
        type,
        distance_m: Math.round(dist),
        rating: p.rating as number | undefined,
      };
    });
  } catch (error) {
    console.error(`Places search failed for ${type}:`, error);
    return [];
  }
}

function haversineDistance(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinLng *
      sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export async function computeCommute(
  origin: LatLng,
  destinationAddress: string = "Stephansplatz 1, 1010 Wien"
): Promise<number | undefined> {
  try {
    const dest = await geocodeAddress(destinationAddress);
    if (!dest) return undefined;

    const res = await fetch(ROUTES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": MAPS_API_KEY,
        "X-Goog-FieldMask": "routes.duration",
      },
      body: JSON.stringify({
        origin: {
          location: {
            latLng: { latitude: origin.lat, longitude: origin.lng },
          },
        },
        destination: {
          location: { latLng: { latitude: dest.lat, longitude: dest.lng } },
        },
        travelMode: "TRANSIT",
      }),
    });
    const data = await res.json();
    const durationStr = data.routes?.[0]?.duration;
    if (durationStr) {
      return Math.round(parseInt(durationStr.replace("s", "")) / 60);
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export async function enrichWithMaps(address: string) {
  const location = await geocodeAddress(address);
  if (!location) {
    return {
      schools: [],
      transit: [],
      supermarkets: [],
      commute_center_min: undefined,
    };
  }

  const [schools, transit, supermarkets, commute] = await Promise.all([
    searchNearby(location, "school", 1000),
    searchNearby(location, "subway_station", 1000),
    searchNearby(location, "supermarket", 500),
    computeCommute(location),
  ]);

  return {
    schools: schools.slice(0, 3),
    transit: transit.slice(0, 3),
    supermarkets: supermarkets.slice(0, 3),
    commute_center_min: commute,
  };
}
