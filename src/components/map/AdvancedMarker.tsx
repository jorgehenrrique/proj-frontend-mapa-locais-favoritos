import { useEffect, useRef } from 'react';
import { useGoogleMap } from '@react-google-maps/api';

interface AdvancedMarkerProps {
  position: google.maps.LatLngLiteral;
  title?: string;
  background?: string;
  glyphColor?: string;
  borderColor?: string;
}

export function AdvancedMarker({
  position,
  title,
  background = '#EA4335',
  glyphColor = '#fff',
  borderColor,
}: AdvancedMarkerProps) {
  const map = useGoogleMap();
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null,
  );

  useEffect(() => {
    if (!map) return;

    // Remove marcador anterior se existir
    if (markerRef.current) {
      markerRef.current.map = null;
      markerRef.current = null;
    }

    const pin = new google.maps.marker.PinElement({
      background,
      glyphColor,
      borderColor: borderColor ?? background,
    });

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      title: title ?? '',
      content: pin,
    });

    markerRef.current = marker;

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
    };
  }, [map, position, title, background, glyphColor, borderColor]);

  return null;
}
