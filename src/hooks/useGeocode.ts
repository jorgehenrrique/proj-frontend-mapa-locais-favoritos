import { useQuery } from '@tanstack/react-query';
import type { GeocodingResult } from '../types/map';

async function geocodeAddress(
  address: string,
): Promise<GeocodingResult | null> {
  if (!address.trim()) return null;

  const geocoder = new google.maps.Geocoder();
  const response = await geocoder.geocode({ address });

  if (!response.results.length) return null;

  const result = response.results[0];
  return {
    formattedAddress: result.formatted_address,
    location: {
      lat: result.geometry.location.lat(),
      lng: result.geometry.location.lng(),
    },
  };
}

export function useGeocode(address: string) {
  return useQuery({
    queryKey: ['geocode', address],
    queryFn: () => geocodeAddress(address),
    enabled: address.trim().length > 2,
    staleTime: 1000 * 60 * 10, // 10 min
  });
}
