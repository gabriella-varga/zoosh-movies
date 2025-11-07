import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  Typography, 
  CircularProgress, 
  Alert,
  Chip,
  Stack,
  Divider,
  Avatar
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MovieIcon from '@mui/icons-material/Movie';
import type { Movie } from '../types';
import MovieRating from './MovieRating';
import { useTranslation } from 'react-i18next';

type MovieListProps = {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  isLoading?: boolean;
};

export default function MovieList({ movies, onMovieClick, isLoading = false }: MovieListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (movies.length === 0) {
    return (
      <Alert severity="info" sx={{ marginTop: 2 }}>
        {t('movieList.noMoviesFound')}
      </Alert>
    );
  }

  return (
    <List sx={{ width: '100%' }}>
      {movies.map((movie, index) => {
        const releaseYear = movie.releaseDate 
          ? new Date(movie.releaseDate).getFullYear() 
          : null;

        return (
          <div key={movie.id}>
            <ListItem disablePadding sx={{ mb: 2 }}>
              <ListItemButton
                className="movie-item-button"
                onClick={() => onMovieClick(movie)}
              >
                <Avatar
                  src={movie.poster?.small || undefined}
                  variant="rounded"
                  className="movie-poster-avatar"
                >
                  <MovieIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                </Avatar>

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Box sx={{ width: '100%', marginBottom: 0 }}>
                    <Typography 
                      variant="h6" 
                      component="div" 
                      sx={{ fontWeight: 600, marginBottom: 4, lineHeight: 1.2 }}
                    >
                      {movie.name}
                    </Typography>
                    {movie.tagline && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ fontStyle: 'italic', marginTop: 4 }}
                      >
                        "{movie.tagline}"
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <MovieRating score={movie.score} size="small" />
                  </Box>

                  {movie.genres && movie.genres.length > 0 && (
                    <Stack direction="row" spacing={0.5} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
                      {movie.genres.map((genre) => (
                        <Chip
                          key={genre.id}
                          label={genre.name}
                          size="small"
                          className="genre-chip"
                        />
                      ))}
                    </Stack>
                  )}

                  <Stack 
                    direction="row" 
                    spacing={1} 
                    sx={{ flexWrap: 'wrap', gap: 1 }}
                    divider={<Divider orientation="vertical" flexItem />}
                  >
                    {releaseYear && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {releaseYear}
                        </Typography>
                      </Box>
                    )}
                    {movie.runtime && (
                      <Typography variant="caption" color="text.secondary">
                        {movie.runtime} {t('movieList.minutes')}
                      </Typography>
                    )}
                    {movie.adult && (
                      <Chip
                        label={t('movieList.adultContent')}
                        size="small"
                        className="adult-chip"
                      />
                    )}
                  </Stack>
                </Box>
              </ListItemButton>
            </ListItem>
            {index < movies.length - 1 && <Divider sx={{ my: 1, opacity: 0.3 }} />}
          </div>
        );
      })}
    </List>
  );
}

