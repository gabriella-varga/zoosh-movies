import React from 'react';
import { Box, Typography, CircularProgress, Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useTranslation } from 'react-i18next';

interface MovieRatingProps {
  score: number | null | undefined;
  maxScore?: number;
  showStars?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const MovieRating: React.FC<MovieRatingProps> = ({ 
  score, 
  maxScore = 10, 
  showStars = false,
  size = 'medium'
}) => {
  const { t } = useTranslation();

  if (score === null || score === undefined) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t('common.notAvailable')}
      </Typography>
    );
  }

  const percentage = (score / maxScore) * 100;
  const starValue = (score / maxScore) * 5; // Convert to 5-star scale

  if (showStars) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Rating
          value={starValue}
          readOnly
          precision={0.1}
          size={size}
          emptyIcon={<StarIcon style={{ opacity: 0.3 }} />}
        />
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {score.toFixed(1)}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={size === 'small' ? 40 : size === 'large' ? 60 : 50}
          thickness={4}
          sx={{
            color: percentage >= 70 ? 'success.main' : percentage >= 50 ? 'warning.main' : 'error.main',
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant={size === 'small' ? 'caption' : 'body2'} component="div" fontWeight={600}>
            {score.toFixed(1)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MovieRating;

