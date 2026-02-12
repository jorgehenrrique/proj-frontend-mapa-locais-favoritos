import { useCallback, useRef, useEffect } from 'react';
import { GoogleMap, InfoWindow } from '@react-google-maps/api';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../../config/env';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { SaveLocationPanel } from './SaveLocationPanel';
import { AdvancedMarker } from './AdvancedMarker';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

export function MapView() {
  const mapRef = useRef<google.maps.Map | null>(null);

  const {
    favorites,
    selectedPlace,
    mapCenter,
    searchMarker,
    clickedPosition,
    setClickedPosition,
  } = useFavoritesStore();

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  /* Centralizar mapa quando mapCenter mudar */
  useEffect(() => {
    if (mapRef.current && mapCenter) {
      mapRef.current.panTo(mapCenter);
      mapRef.current.setZoom(15);
    }
  }, [mapCenter]);

  /* Centralizar mapa quando searchMarker mudar */
  useEffect(() => {
    if (mapRef.current && searchMarker) {
      mapRef.current.panTo(searchMarker);
      mapRef.current.setZoom(15);
    }
  }, [searchMarker]);

  /* Fechar SaveLocationPanel com ESC */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && clickedPosition) {
        setClickedPosition(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [clickedPosition, setClickedPosition]);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        setClickedPosition({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        });
      }
    },
    [setClickedPosition],
  );

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleMapClick}
      options={{
        mapId: 'MAPA_LOCAIS_FAVORITOS',
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        backgroundColor: 'hsl(var(--muted))',
      }}
    >
      {/* Marcador da busca (azul) */}
      {searchMarker && (
        <AdvancedMarker
          position={searchMarker}
          background='#4285F4'
          glyphColor='#fff'
          title='Local encontrado'
        />
      )}

      {/* Marcadores dos favoritos (vermelho, ou amarelo se selecionado) */}
      {favorites.map((fav) => {
        const isSelected = selectedPlace?.id === fav.id;
        return (
          <AdvancedMarker
            key={fav.id}
            position={{ lat: fav.lat, lng: fav.lng }}
            title={fav.name}
            background={isSelected ? '#FBBC04' : '#EA4335'}
            glyphColor={isSelected ? '#000' : '#fff'}
          />
        );
      })}

      {/* Clique no mapa — InfoWindow para salvar */}
      {clickedPosition && (
        <InfoWindow
          position={clickedPosition}
          onCloseClick={() => setClickedPosition(null)}
          options={{
            headerDisabled: true,
          }}
        >
          <SaveLocationPanel
            position={clickedPosition}
            onClose={() => setClickedPosition(null)}
          />
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
