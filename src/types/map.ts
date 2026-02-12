export interface FavoritePlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface GeocodingResult {
  formattedAddress: string;
  location: LatLng;
}
