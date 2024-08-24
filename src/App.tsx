// src/App.tsx
import React, { useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import AutocompleteInput from './components/AutocompleteInput';
import { haversineDistance } from './utils/calculateDistance';
import Map from './components/Map';

interface Airport {
  code: string;
  name: string;
  lat: number;
  lng: number;
}

const App: React.FC = () => {
  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const calculateDistance = () => {
    if (origin && destination) {
      const dist = haversineDistance(origin.lat, origin.lng, destination.lat, destination.lng);
      setDistance(dist);
    }
  };

  const handleOriginChange = (airport: Airport | null) => {
    setOrigin(airport);
    setDistance(null);
  };

  const handleDestinationChange = (airport: Airport | null) => {
    setDestination(airport);
    setDistance(null);
  };

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>Airport Distance Calculator</Typography>
        <AutocompleteInput label="Origin Airport" onSelect={handleOriginChange} />
        <AutocompleteInput label="Destination Airport" onSelect={handleDestinationChange} />
        <Box mt={2}>
          <button onClick={calculateDistance}>Calculate Distance</button>
        </Box>
        {distance !== null && (
          <Box mt={2}>
            <Typography variant="h6">Distance: {distance.toFixed(2)} nautical miles</Typography>
          </Box>
        )}
        <Map origin={origin} destination={destination} />
      </Box>
    </Container>
  );
};

export default App;
