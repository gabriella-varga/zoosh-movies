// Zoosh TMDB + Wikipedia React TypeScript App (Vite + Apollo + MUI)
// ─────────────────────────────────────────────────────────────────────────────
// Directory layout shown inline. Copy files into a fresh Vite React TS project
// or use the commands in README below.

// ─────────────────────────────────────────────────────────────────────────────
// package.json
// (If you scaffold with `npm create vite@latest`, merge dependencies & scripts.)
{
  "name": "zoosh-movies",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui"
  },
  "dependencies": {
    "@apollo/client": "^3.11.8",
    "@emotion/react": "^11.13.0",
    "@emotion/styled": "^11.13.0",
    "@mui/icons-material": "^6.1.6",
    "@mui/material": "^6.1.6",
    "cross-fetch": "^4.0.0",
    "graphql": "^16.9.0",
    "luxon": "^3.5.0",
    "ramda": "^0.29.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^20.14.11",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "happy-dom": "^15.11.7",
    "typescript": "^5.6.2",
    "vite": "^5.4.8",
    "vitest": "^2.1.2"
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});

// ─────────────────────────────────────────────────────────────────────────────
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import App from './App';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://tmdb.sandbox.zoosh.ie/', fetch: fetch }),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}> 
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// ─────────────────────────────────────────────────────────────────────────────
// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: { mode: 'light' },
  shape: { borderRadius: 16 },
  typography: { fontFamily: 'Inter, system-ui, Roboto, Arial, sans-serif' },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 12 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
  },
});

export default theme;

// ─────────────────────────────────────────────────────────────────────────────
// src/types.ts
export type Movie = {
  id: string;
  title: string;
  overview?: string | null;
  releaseDate?: string | null;
  voteAverage?: number | null;
  genres?: { id: string; name: string }[];
};

// ─────────────────────────────────────────────────────────────────────────────
// src/graphql/queries.ts
import { gql } from '@apollo/client';

// NOTE: Field names follow typical TMDB GraphQL sandboxes. Adjust if schema differs.
export const SEARCH_MOVIES = gql`
  query SearchMovies($query: String!, $page: Int) {
    searchMovies(query: $query, page: $page) {
      page
      totalResults
      results {
        id
        title
        overview
        releaseDate
        voteAverage
        genres { id name }
      }
    }
  }
`;

export const MOVIE_DETAILS_WITH_SIMILAR = gql`
  query MovieDetailsWithSimilar($id: ID!, $page: Int) {
    movie(id: $id) {
      id
      title
      overview
      releaseDate
      voteAverage
      genres { id name }
      similar(page: $page) {
        page
        totalResults
        results { id title voteAverage releaseDate }
      }
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// src/services/wiki.ts
export type WikiSummary = { title: string; extract: string; url: string };

const WIKI_API = 'https://en.wikipedia.org/api/rest_v1';

export async function fetchWikiSummary(title: string): Promise<WikiSummary | null> {
  // 1) Try exact page summary
  const encoded = encodeURIComponent(title);
  const exact = await fetch(`${WIKI_API}/page/summary/${encoded}`, {
    headers: { 'Accept': 'application/json' },
  });
  if (exact.ok) {
    const data = await exact.json();
    if (data?.extract && data?.content_urls?.desktop?.page) {
      return { title: data.title, extract: data.extract, url: data.content_urls.desktop.page };
    }
  }
  // 2) Fallback: search
  const search = await fetch(`https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encoded}&limit=1&lang=en`, {
    headers: { 'Accept': 'application/json' },
  });
  if (search.ok) {
    const data = await search.json();
    const hit = data?.pages?.[0];
    if (hit?.title) {
      const t = encodeURIComponent(hit.title);
      const res = await fetch(`${WIKI_API}/page/summary/${t}`);
      if (res.ok) {
        const d = await res.json();
        if (d?.extract && d?.content_urls?.desktop?.page) {
          return { title: d.title, extract: d.extract, url: d.content_urls.desktop.page };
        }
      }
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// src/components/SearchBar.tsx
import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Props { value: string; onChange: (v: string) => void; onSearch: () => void; }

const SearchBar: React.FC<Props> = ({ value, onChange, onSearch }) => {
  const submit = (e: React.FormEvent) => { e.preventDefault(); onSearch(); };
  return (
    <Box component="form" onSubmit={submit} sx={{ display: 'flex', gap: 1 }}>
      <TextField
        autoFocus
        fullWidth
        label="Search movies"
        placeholder="Type a title and press Enter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <IconButton type="submit" aria-label="search"><SearchIcon /></IconButton>
    </Box>
  );
};
export default SearchBar;

// ─────────────────────────────────────────────────────────────────────────────
// src/components/MovieList.tsx
import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Stack, Chip } from '@mui/material';
import { Movie } from '../types';

interface Props { movies: Movie[]; onSelect: (m: Movie) => void; }

const MovieList: React.FC<Props> = ({ movies, onSelect }) => {
  return (
    <Stack spacing={1}>
      {movies.map((m) => (
        <Card key={m.id} variant="outlined">
          <CardActionArea onClick={() => onSelect(m)}>
            <CardContent>
              <Typography variant="h6">{m.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Score: {m.voteAverage ?? '—'} {m.releaseDate ? `• ${m.releaseDate}` : ''}
              </Typography>
              {m.genres && m.genres.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                  {m.genres.slice(0, 5).map((g) => <Chip key={g.id} size="small" label={g.name} />)}
                </Stack>
              )}
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
  );
};
export default MovieList;

// ─────────────────────────────────────────────────────────────────────────────
// src/components/MovieDetail.tsx
import React from 'react';
import { Box, Typography, Link as MLink, CircularProgress, Stack, Button } from '@mui/material';
import { useQuery } from '@apollo/client';
import { MOVIE_DETAILS_WITH_SIMILAR } from '../graphql/queries';
import { fetchWikiSummary } from '../services/wiki';
import type { Movie } from '../types';

interface Props { movie: Movie; onSwitchToRelated: (movies: Movie[]) => void; }

const MovieDetail: React.FC<Props> = ({ movie, onSwitchToRelated }) => {
  const { data, loading, error } = useQuery(MOVIE_DETAILS_WITH_SIMILAR, { variables: { id: movie.id, page: 1 } });
  const [wiki, setWiki] = React.useState<{ text: string; url: string } | null>(null);
  const [wikiLoading, setWikiLoading] = React.useState(false);

  React.useEffect(() => {
    let ignore = false;
    (async () => {
      setWikiLoading(true);
      try {
        const s = await fetchWikiSummary(movie.title);
        if (!ignore) setWiki(s ? { text: s.extract, url: s.url } : null);
      } finally { setWikiLoading(false); }
    })();
    return () => { ignore = true; };
  }, [movie.id, movie.title]);

  const similar: Movie[] = data?.movie?.similar?.results ?? [];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 1 }}>{movie.title}</Typography>
      {loading ? (
        <Stack direction="row" alignItems="center" gap={1}><CircularProgress size={20} /> <Typography>Loading details…</Typography></Stack>
      ) : error ? (
        <Typography color="error">Failed to load details.</Typography>
      ) : (
        <>
          <Typography variant="body1" sx={{ mb: 2 }}>{data?.movie?.overview ?? 'No overview available.'}</Typography>
          <Stack direction="row" gap={1} sx={{ mb: 2 }}>
            <Button variant="outlined" onClick={() => onSwitchToRelated(similar)} disabled={!similar?.length}>Related</Button>
          </Stack>
        </>
      )}

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Wikipedia</Typography>
        {wikiLoading && <Stack direction="row" alignItems="center" gap={1}><CircularProgress size={20} /> <Typography>Searching Wikipedia…</Typography></Stack>}
        {!wikiLoading && wiki && (
          <>
            <Typography variant="body2" sx={{ mb: 1 }}>{wiki.text}</Typography>
            <MLink href={wiki.url} target="_blank" rel="noreferrer">Open on Wikipedia</MLink>
          </>
        )}
        {!wikiLoading && !wiki && <Typography color="text.secondary">No Wikipedia summary found.</Typography>}
      </Box>
    </Box>
  );
};
export default MovieDetail;

// ─────────────────────────────────────────────────────────────────────────────
// src/App.tsx
import React from 'react';
import { Container, Grid2 as Grid, Paper, CircularProgress, Typography } from '@mui/material';
import SearchBar from './components/SearchBar';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_MOVIES } from './graphql/queries';
import type { Movie } from './types';

const App: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<Movie | null>(null);
  const [listTitle, setListTitle] = React.useState('Results');

  const [runSearch, { data, loading, error }] = useLazyQuery(SEARCH_MOVIES, {
    notifyOnNetworkStatusChange: true,
  });

  const movies: Movie[] = data?.searchMovies?.results ?? [];

  const doSearch = () => {
    if (!query.trim()) return;
    setSelected(null);
    setListTitle('Results');
    runSearch({ variables: { query: query.trim(), page: 1 } });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Movie Finder</Typography>
      <SearchBar value={query} onChange={setQuery} onSearch={doSearch} />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2, minHeight: 400 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>{listTitle}</Typography>
            {loading && <CircularProgress size={24} />}
            {error && <Typography color="error">Failed to load results.</Typography>}
            {!loading && !error && (
              <MovieList movies={movies} onSelect={(m) => setSelected(m)} />
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2, minHeight: 400 }}>
            {selected ? (
              <MovieDetail
                movie={selected}
                onSwitchToRelated={(related) => {
                  setListTitle('Related');
                  setSelected(null);
                  // Replace list with related items via a fake data object
                  // so we can reuse MovieList renderer.
                  (data as any).searchMovies = { results: related };
                }}
              />
            ) : (
              <Typography color="text.secondary">Select a movie to see details & Wikipedia.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
export default App;

// ─────────────────────────────────────────────────────────────────────────────
// src/__tests__/wiki.test.ts
import { describe, it, expect, vi } from 'vitest';
import { fetchWikiSummary } from '../services/wiki';

describe('fetchWikiSummary', () => {
  it('returns null gracefully on 404', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const res = await fetchWikiSummary('NonExistingTitle');
    expect(res).toBeNull();
    (fetch as any).mockRestore?.();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// src/__tests__/App.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import App from '../App';

// Smoke test just verifies component renders without crashing.

describe('App', () => {
  it('renders title', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Movie Finder/i)).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// index.html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Movie Finder</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

// ─────────────────────────────────────────────────────────────────────────────
// README.md (setup & run)
# Zoosh Movie Finder (React + TS)

Minimal, clean codebase that:
- Searches TMDB via GraphQL (Apollo Client)
- Shows a list (title, score, release date, genres)
- Click to see details + Wikipedia summary (with outbound link)
- Bonus: switch list to *Related* movies of the selected item
- Bonus: Material UI look & loading spinners
- Bonus: Tests (Vitest + RTL)

## Quickstart
```bash
# 1) Scaffold
npm create vite@latest zoosh-movies -- --template react-ts
cd zoosh-movies

# 2) Add deps
npm i @apollo/client graphql @mui/material @mui/icons-material @emotion/react @emotion/styled luxon ramda cross-fetch
npm i -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event happy-dom @types/node

# 3) Replace/add files from this repository
#    - vite.config.ts, src/*, index.html, package.json scripts

# 4) Run
npm run dev

# 5) Test
npm test
```

## Notes
- GraphQL schema in the sandbox may differ. If `searchMovies`/field names vary, adjust the query/field selections in `src/graphql/queries.ts` accordingly; the UI is schema-agnostic beyond those selections.
- Wikipedia integration uses public REST endpoints without helper libraries, as requested.
- Clean, modular structure; no inline CSS; MUI used for layout/spacing and accessibility.
