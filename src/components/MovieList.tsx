import React from 'react';
import { Box, List, ListItem, ListItemButton, Typography, CircularProgress, Alert } from '@mui/material';
import type { Movie } from '../types';

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  isLoading?: boolean;
}

const MovieList: React.FC<MovieListProps> = ({ movies, onMovieClick, isLoading = false }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (movies.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No movies found. Try a different search query.
      </Alert>
    );
  }

  return (
    <List sx={{ width: '100%' }}>
      {movies.map((movie) => {
        const category = movie.genres?.map(g => g.name).join(', ') || 'Unknown';
        const score = movie.score !== null && movie.score !== undefined 
          ? movie.score.toFixed(1) 
          : 'N/A';

        return (
          <ListItem key={movie.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => onMovieClick(movie)}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                py: 2,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                  {movie.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Category:</strong> {category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Score:</strong> {score}
                  </Typography>
                </Box>
              </Box>
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default MovieList;

