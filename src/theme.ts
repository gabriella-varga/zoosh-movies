import { createTheme } from '@mui/material/styles';

const COLORS = {
  primary: '#FFB300',
  secondary: '#BB86FC',
  background: {
    default: '#121212',
    paper: '#1E1E1E',
    appBar: '#181818',
  },
  text: {
    primary: '#E0E0E0',
    secondary: '#9E9E9E',
  },
  divider: '#2C2C2C',
  overlay: {
    dark: 'rgba(0, 0, 0, 0.7)',
    medium: 'rgba(0, 0, 0, 0.3)',
  },
  glow: {
    primary: {
      inner: 'rgba(255, 179, 0, 0.3)',
      outer: 'rgba(255, 179, 0, 0.15)',
    },
  },
} as const;

export { COLORS };

const theme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: COLORS.background.default,
        paper: COLORS.background.paper,
      },
      primary: { main: COLORS.primary },
      secondary: { main: COLORS.secondary },
      text: {
        primary: COLORS.text.primary,
        secondary: COLORS.text.secondary,
      },
      divider: COLORS.divider,
    },
    shape: { 
      borderRadius: 8,
    },
    typography: {
      overline: {
        marginBottom: 0,
      },
    },
    components: {
      MuiContainer: {
        styleOverrides: {
          root: {
            '&.app-container': {
              boxShadow: `0 0 40px ${COLORS.glow.primary.inner}, 0 0 80px ${COLORS.glow.primary.outer}`,
              borderRadius: 8,
              padding: 24,
              marginTop: 16,
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { backgroundColor: COLORS.background.appBar },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&.movie-item-button': {
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 8,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 16,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderColor: 'primary.main',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            '&.genre-chip': {
              backgroundColor: 'primary.dark',
              color: 'primary.contrastText',
              fontSize: '0.75rem',
              height: 24,
            },
            '&.adult-chip': {
              height: 20,
              fontSize: '0.65rem',
              backgroundColor: 'error.dark',
              color: 'error.contrastText',
            },
            '&.adult-chip-large': {
              backgroundColor: 'error.dark',
              color: 'error.contrastText',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            '&.movie-details-card': {
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            },
          },
        },
      },
      MuiCardMedia: {
        styleOverrides: {
          root: {
            '&.movie-poster': {
              width: 150,
              height: 225,
              borderRadius: 8,
              objectFit: 'cover',
              flexShrink: 0,
              boxShadow: 3,
            },
            '&.movie-backdrop': {
              height: 200,
              objectFit: 'cover',
              background: `linear-gradient(to bottom, ${COLORS.overlay.dark}, ${COLORS.overlay.medium})`,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            '&.movie-poster-avatar': {
              width: 80,
              height: 120,
              backgroundColor: 'background.paper',
              flexShrink: 0,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            '&.overview-paper': {
              padding: 16,
              backgroundColor: 'background.default',
              borderColor: 'divider',
            },
          },
        },
      },
    },
  });

export default theme;