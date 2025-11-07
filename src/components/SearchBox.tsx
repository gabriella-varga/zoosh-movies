import { useState } from 'react';
import type { FormEvent } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

type SearchBoxProps = {
  onSearch: (query: string) => void;
  isLoading?: boolean;
};

export default function SearchBox({ onSearch, isLoading = false }: SearchBoxProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 6, display: 'flex', gap: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={t('search.placeholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isLoading}
        sx={{ flexGrow: 1 }}
      />
      <Button
        type="submit"
        variant="contained"
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
        disabled={isLoading || !query.trim()}
        sx={{ minWidth: 120 }}
      >
        {isLoading ? t('search.searching') : t('search.button')}
      </Button>
    </Box>
  );
}

