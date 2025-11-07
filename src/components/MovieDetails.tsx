import { useState, useEffect } from 'react';
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
  CardMedia,
  CircularProgress,
  Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import PublicIcon from '@mui/icons-material/Public';
import MovieIcon from '@mui/icons-material/Movie';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { Movie } from '../types';
import MovieRating from './MovieRating';
import { useTranslation } from 'react-i18next';
import { fetchWikipediaSummary, type WikipediaSummary } from '../services/wikipedia';

type MovieDetailsProps = {
  movie: Movie | null;
  onBack?: () => void;
};

const detailItemStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const iconStyles = {
  fontSize: 20,
  color: 'text.secondary',
};

export default function MovieDetails({ movie, onBack }: MovieDetailsProps) {
  const { t } = useTranslation();
  const [wikipediaData, setWikipediaData] = useState<WikipediaSummary | null>(null);
  const [wikipediaLoading, setWikipediaLoading] = useState(false);

  useEffect(() => {
    if (!movie) {
      setWikipediaData(null);
      return;
    }

    let ignore = false;

    const fetchWikipedia = async () => {
      setWikipediaLoading(true);
      try {
        const summary = await fetchWikipediaSummary(movie.name);
        if (!ignore) {
          setWikipediaData(summary);
        }
      } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
        if (!ignore) {
          setWikipediaData(null);
        }
      } finally {
        if (!ignore) {
          setWikipediaLoading(false);
        }
      }
    };

    fetchWikipedia();

    return () => {
      ignore = true;
    };
  }, [movie?.id, movie?.name]);

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
    <Card className="movie-details-card">
      {movie.backdrop?.large && (
        <CardMedia
          component="img"
          image={movie.backdrop.large}
          alt={movie.name}
          className="movie-backdrop"
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
              className="movie-poster"
            />
          ) : (
            <Box sx={{ 
              width: 150, 
              height: 225, 
              borderRadius: 2, 
              bgcolor: 'background.paper', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexShrink: 0, 
              boxShadow: 3 
            }}>
              <MovieIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
            </Box>
          )}
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ fontWeight: 700, lineHeight: 1.2 }}
            >
              {movie.name}
            </Typography>
            {movie.tagline && (
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ fontStyle: 'italic', marginTop: 8, fontWeight: 400 }}
              >
                "{movie.tagline}"
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block' }}>
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
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block' }}>
              {t('movieDetails.genres')}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {movie.genres.map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  className="genre-chip"
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Stack>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block' }}>
            {t('movieDetails.details')}
          </Typography>
          <Stack spacing={1.5}>
            {releaseDate && (
              <Box sx={detailItemStyles}>
                <CalendarTodayIcon sx={iconStyles} />
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
              <Box sx={detailItemStyles}>
                <AccessTimeIcon sx={iconStyles} />
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
              <Box sx={detailItemStyles}>
                <LanguageIcon sx={iconStyles} />
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
              <Box sx={detailItemStyles}>
                <PublicIcon sx={iconStyles} />
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
                className="adult-chip-large"
                sx={{ alignSelf: 'flex-start' }}
              />
            )}
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        {movie.overview && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block' }}>
              {t('movieDetails.overview')}
            </Typography>
            <Paper variant="outlined" className="overview-paper">
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                {movie.overview}
              </Typography>
            </Paper>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            {t('movieDetails.wikipedia')}
          </Typography>
          {wikipediaLoading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                {t('movieDetails.wikipediaLoading')}
              </Typography>
            </Stack>
          )}
          {!wikipediaLoading && wikipediaData && (
            <>
              <Paper variant="outlined" className="overview-paper" sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                  {wikipediaData.extract}
                </Typography>
              </Paper>
              <Link
                href={wikipediaData.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {t('movieDetails.wikipediaOpenLink')}
                <OpenInNewIcon sx={{ fontSize: 16 }} />
              </Link>
            </>
          )}
          {!wikipediaLoading && !wikipediaData && (
            <Typography variant="body2" color="text.secondary">
              {t('movieDetails.wikipediaNotFound')}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

