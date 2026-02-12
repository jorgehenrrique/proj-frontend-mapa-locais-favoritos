import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FavoritePlace, LatLng } from '../types/map';

interface FavoritesState {
  favorites: FavoritePlace[];
  selectedPlace: FavoritePlace | null;
  mapCenter: LatLng | null;
  searchMarker: LatLng | null;
  clickedPosition: LatLng | null;

  addFavorite: (place: Omit<FavoritePlace, 'id'>) => void;
  removeFavorite: (id: string) => void;
  selectPlace: (place: FavoritePlace | null) => void;
  setMapCenter: (center: LatLng) => void;
  setSearchMarker: (position: LatLng | null) => void;
  setClickedPosition: (position: LatLng | null) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favorites: [],
      selectedPlace: null,
      mapCenter: null,
      searchMarker: null,
      clickedPosition: null,

      addFavorite: (place) =>
        set((state) => ({
          favorites: [
            ...state.favorites,
            { ...place, id: crypto.randomUUID() },
          ],
          clickedPosition: null,
        })),

      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
          selectedPlace:
            state.selectedPlace?.id === id ? null : state.selectedPlace,
        })),

      selectPlace: (place) =>
        set({
          selectedPlace: place,
          mapCenter: place ? { lat: place.lat, lng: place.lng } : null,
          searchMarker: null,
          clickedPosition: null,
        }),

      setMapCenter: (center) => set({ mapCenter: center }),

      setSearchMarker: (position) =>
        set({
          searchMarker: position,
          clickedPosition: null,
          selectedPlace: null,
        }),

      setClickedPosition: (position) =>
        set({
          clickedPosition: position,
          searchMarker: null,
          selectedPlace: null,
        }),
    }),
    {
      name: 'favorites-storage',
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
);
