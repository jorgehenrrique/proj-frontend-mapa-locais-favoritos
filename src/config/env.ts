export const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

export const GOOGLE_MAPS_LIBRARIES: ('places' | 'geocoding' | 'marker')[] = [
  'places',
  'geocoding',
  'marker',
];

/** Uberlândia-MG — posição padrão do mapa */
export const DEFAULT_CENTER = { lat: -18.9186, lng: -48.2772 } as const;

/** Zoom inicial */
export const DEFAULT_ZOOM = 13;
