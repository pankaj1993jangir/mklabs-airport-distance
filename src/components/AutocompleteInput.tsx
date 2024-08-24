import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';

interface Airport {
  code: string;
  name: string;
  lat: number;  
  lng: number; 
}

interface AutocompleteInputProps {
  label: string;
  onSelect: (airport: Airport | null) => void;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ label, onSelect }) => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAirports = async () => {
      const response = await axios.get('/us-airports.json');
      setAirports(response.data);
      setLoading(false);
    };

    fetchAirports();
  }, []);

  return (
    <Autocomplete
      options={airports}
      getOptionLabel={(option) => `${option.name} (${option.code})`}
      onChange={(_, value) => onSelect(value)}
      loading={loading}
      renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
    />
  );
};

export default AutocompleteInput;
