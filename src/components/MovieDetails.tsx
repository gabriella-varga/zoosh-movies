import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Button,
  Stack,
  Divider,
  Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import PublicIcon from '@mui/icons-material/Public';
import type { Movie } from '../types';
import MovieRating from './MovieRating';

interface MovieDetailsProps {
  movie: Movie | null;
  onBack?: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onBack }) => {
  if (!movie) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            Select a movie to see details
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const releaseYear = movie.releaseDate 
    ? new Date(movie.releaseDate).getFullYear() 
    : null;
  const releaseDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : null;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {onBack && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ mb: 3 }}
          >
            Back to Results
          </Button>
        )}
        
        {/* Title Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {movie.name}
          </Typography>
          {movie.tagline && (
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                fontStyle: 'italic', 
                mt: 1,
                fontWeight: 400,
              }}
            >
              "{movie.tagline}"
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Rating Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Rating
          </Typography>
          <MovieRating score={movie.score} size="large" showStars />
          {movie.votes && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              ({movie.votes.toLocaleString()} votes)
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Genres Section */}
        {movie.genres && movie.genres.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
              Genres
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {movie.genres.map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  sx={{
                    backgroundColor: 'primary.dark',
                    color: 'primary.contrastText',
                    fontWeight: 500,
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Metadata Tags Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
            Details
          </Typography>
          <Stack spacing={1.5}>
            {releaseDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Release Date
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {releaseDate} {releaseYear && `(${releaseYear})`}
                  </Typography>
                </Box>
              </Box>
            )}
            {movie.runtime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Runtime
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {movie.runtime} minutes
                  </Typography>
                </Box>
              </Box>
            )}
            {movie.languages && movie.languages.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LanguageIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Languages
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {movie.languages.map(l => l.name).join(', ')}
                  </Typography>
                </Box>
              </Box>
            )}
            {movie.country && movie.country.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PublicIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Countries
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {movie.country.map(c => c.name).join(', ')}
                  </Typography>
                </Box>
              </Box>
            )}
            {movie.status && (
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Status
                </Typography>
                <Chip
                  label={movie.status.replace('_', ' ')}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            )}
            {movie.adult && (
              <Chip
                label="18+ Adult Content"
                size="small"
                sx={{
                  backgroundColor: 'error.dark',
                  color: 'error.contrastText',
                  alignSelf: 'flex-start',
                }}
              />
            )}
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Overview Section */}
        {movie.overview && (
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
              Overview
            </Typography>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                backgroundColor: 'background.default',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                {movie.overview}
              </Typography>
            </Paper>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MovieDetails;

