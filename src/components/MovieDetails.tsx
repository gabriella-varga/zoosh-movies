import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Button,
  Stack,
  Divider,
  Paper,
  CardMedia
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import PublicIcon from '@mui/icons-material/Public';
import MovieIcon from '@mui/icons-material/Movie';
import type { Movie } from '../types';
import MovieRating from './MovieRating';
import { useTranslation } from 'react-i18next';

type MovieDetailsProps = {
  movie: Movie | null;
  onBack?: () => void;
};

export default function MovieDetails({ movie, onBack }: MovieDetailsProps) {
  const { t } = useTranslation();

  if (!movie) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            {t('movieDetails.selectMovie')}
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
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {movie.backdrop?.large && (
        <CardMedia
          component="img"
          image={movie.backdrop.large}
          alt={movie.name}
          sx={{
            height: 200,
            objectFit: 'cover',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
          }}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
        {onBack && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ mb: 3 }}
          >
            {t('movieDetails.backToResults')}
          </Button>
        )}
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
          {movie.poster?.small ? (
            <CardMedia
              component="img"
              image={movie.poster.small}
              alt={movie.name}
              sx={{
                width: 150,
                height: 225,
                borderRadius: 2,
                objectFit: 'cover',
                flexShrink: 0,
                boxShadow: 3,
              }}
            />
          ) : (
            <Box
              sx={{
                width: 150,
                height: 225,
                borderRadius: 2,
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: 3,
              }}
            >
              <MovieIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
            </Box>
          )}
          
          <Box sx={{ flexGrow: 1 }}>
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
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            {t('movieDetails.rating')}
          </Typography>
          <MovieRating score={movie.score} size="large" showStars />
          {movie.votes && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              ({movie.votes.toLocaleString()} {t('movieDetails.votes')})
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {movie.genres && movie.genres.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
              {t('movieDetails.genres')}
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

        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
            {t('movieDetails.details')}
          </Typography>
          <Stack spacing={1.5}>
            {releaseDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {t('movieDetails.releaseDate')}
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
                    {t('movieDetails.runtime')}
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {movie.runtime} {t('movieDetails.minutes')}
                  </Typography>
                </Box>
              </Box>
            )}
            {movie.languages && movie.languages.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LanguageIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {t('movieDetails.languages')}
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
                    {t('movieDetails.countries')}
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
                  {t('movieDetails.status')}
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
                label={t('movieDetails.adultContent')}
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

        {movie.overview && (
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
              {t('movieDetails.overview')}
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
}

