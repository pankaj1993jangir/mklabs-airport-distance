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
    
    // Default center coordinates over the United States
    const defaultCenter = { lat: 39.8283, lng: -98.5795 };

    useEffect(() => {
        if (mapRef.current) {
            markers.current.forEach(marker => {
                marker.setMap(null);
            });
            markers.current = [];

            const originContent = document.createElement('div');
            originContent.innerHTML = '<div>Origin</div>';

            const destinationContent = document.createElement('div');
            destinationContent.innerHTML = '<div>Destination</div>';

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
                lat: ((origin?.lat || defaultCenter.lat) + (destination?.lat || defaultCenter.lat)) / 2,
                lng: ((origin?.lng || defaultCenter.lng) + (destination?.lng || defaultCenter.lng)) / 2,
            }}
            mapContainerStyle={{ width: '100%', height: '600px' }}
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
