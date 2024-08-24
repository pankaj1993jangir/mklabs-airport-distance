import React, { useEffect, useState, useCallback } from 'react';
import { Container, Box, Typography } from '@mui/material';
import AutocompleteInput from './components/AutocompleteInput';
import { haversineDistance } from './utils/calculateNauticalDistance';
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

  const handleOriginChange = (airport: Airport | null) => {
    setOrigin(airport);
  };

  const handleDestinationChange = (airport: Airport | null) => {
    setDestination(airport);
  };

  const calculateDistance = useCallback(() => {
    if (origin && destination) {
      const dist = haversineDistance(origin.lat, origin.lng, destination.lat, destination.lng);
      setDistance(dist);
    } else {
      setDistance(null); 
    }
  }, [origin, destination]); 

  useEffect(() => {
    calculateDistance();
  }, [calculateDistance]);

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>US Airport Distance Calculator</Typography>
        <Box mt={2}>
          <AutocompleteInput label="Origin Airport" onSelect={handleOriginChange} />
        </Box>
        <Box mt={2}>
          <AutocompleteInput label="Destination Airport" onSelect={handleDestinationChange} />
        </Box>
        {distance !== null && (
          <Box mt={2} style={{ opacity: distance !== null ? 1 : 0, transition: 'opacity 1.5s' }}>
            <Typography variant="h6">Distance: <strong>{distance.toFixed(2)} nautical miles</strong></Typography>
          </Box>
        )}
        <Box mt={2}>
          <Map origin={origin} destination={destination} />
        </Box>
      </Box>
    </Container>
  );
};

export default App;