// src/components/Map.tsx
import React, { useRef, useEffect } from 'react';
import { GoogleMap, Polyline, useLoadScript } from '@react-google-maps/api';

interface MapProps {
  origin?: { lat: number, lng: number } | null;
  destination?: { lat: number, lng: number } | null;
}

const Map: React.FC<MapProps> = ({ origin = { lat: 0, lng: 0 }, destination = { lat: 0, lng: 0 } }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    });

    const mapRef = useRef<google.maps.Map | null>(null);
    const markers = useRef<google.maps.Marker[]>([]);

    useEffect(() => {
        if (mapRef.current) {
            // Clear existing markers
            markers.current.forEach(marker => {
                marker.setMap(null);
            });
            markers.current = [];

            // Create DOM elements for marker content
            const originContent = document.createElement('div');
            originContent.innerHTML = '<div>Origin</div>';

            const destinationContent = document.createElement('div');
            destinationContent.innerHTML = '<div>Destination</div>';

            // Add markers for origin and destination
            if (origin) {
                const originMarker = new google.maps.Marker({
                    position: origin,
                    map: mapRef.current,
                });
                markers.current.push(originMarker);
            }

            if (destination) {
                const destinationMarker = new google.maps.Marker({
                    position: destination,
                    map: mapRef.current,
                });
                markers.current.push(destinationMarker);
            }
        }
    }, [origin, destination]);

    if (loadError) return <div>Error loading maps: {loadError.message}</div>;
    if (!isLoaded) return <div>Loading...</div>;

    return (
        <GoogleMap
            zoom={5}
            center={{
                lat: ((origin?.lat || 0) + (destination?.lat || 0)) / 2,
                lng: ((origin?.lng || 0) + (destination?.lng || 0)) / 2,
            }}
            mapContainerStyle={{ width: '100%', height: '400px' }}
            onLoad={(map) => {
                mapRef.current = map;
            }}
        >
            <Polyline
                path={[origin!, destination!]}
                options={{
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                }}
            />
        </GoogleMap>
    );
};

export default Map;
