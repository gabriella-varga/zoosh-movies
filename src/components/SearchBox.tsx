import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, isLoading = false }) => {
  const [query, setQuery] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, display: 'flex', gap: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
        sx={{ flexGrow: 1 }}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
        disabled={isLoading || !query.trim()}
        sx={{ minWidth: 120 }}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </Button>
    </Box>
  );
};

export default SearchBox;

