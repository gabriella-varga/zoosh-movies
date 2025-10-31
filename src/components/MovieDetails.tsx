import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { Movie } from '../types';

interface MovieDetailsProps {
  movie: Movie | null;
  onBack?: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onBack }) => {
  if (!movie) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            Select a movie to see details
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const category = movie.genres?.map(g => g.name).join(', ') || 'Unknown';
  const score = movie.score !== null && movie.score !== undefined 
    ? movie.score.toFixed(1) 
    : 'N/A';

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        {onBack && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ mb: 2 }}
          >
            Back to Results
          </Button>
        )}
        
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          {movie.name}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Category
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {category}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Score
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {score}
            </Typography>
          </Box>
          {movie.releaseDate && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Release Date
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {new Date(movie.releaseDate).getFullYear()}
              </Typography>
            </Box>
          )}
        </Box>

        {movie.genres && movie.genres.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {movie.genres.map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        )}

        {movie.overview && (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Overview
            </Typography>
            <Typography variant="body1">
              {movie.overview}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MovieDetails;

