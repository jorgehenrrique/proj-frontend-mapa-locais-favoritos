import { useQuery } from '@tanstack/react-query';
import type { GeocodingResult } from '../types/map';

async function geocodeAddress(
  address: string,
): Promise<GeocodingResult[]> {
  if (!address.trim()) return [];

  try {
    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({ address });

    if (!response.results.length) return [];

    return response.results.slice(0, 3).map((result) => ({
      formattedAddress: result.formatted_address,
      location: {
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng(),
      },
    }));
  } catch (err: unknown) {
    // ZERO_RESULTS não é um erro real — apenas não encontrou o local
    if (err instanceof Error && err.message.includes('ZERO_RESULTS')) {
      return [];
    }
    throw err;
  }
}

export function useGeocode(address: string) {
  return useQuery({
    queryKey: ['geocode', address],
    queryFn: () => geocodeAddress(address),
    enabled: address.trim().length > 2,
    staleTime: 1000 * 60 * 10, // 10 min
  });
}
