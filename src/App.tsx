import { useState, useMemo } from 'react';
import { GET_RELATED_MOVIES, SEARCH_MOVIES } from './graphql/queries';
import './App.css';
import { useQuery } from "@apollo/client/react";
import { Container, Box, Typography, Grid } from "@mui/material";
import type { Movie } from "./types";
import SearchBox from './components/SearchBox';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import { useTranslation } from "react-i18next";

type SearchMoviesData = {
    searchMovies: Movie[];
};

type MovieWithSimilar = Movie & { similar?: Movie[] | null };

type RelatedMoviesData = {
    movies: MovieWithSimilar[];
};

type RelatedMoviesVars = {
    ids: string[];
    language: string;
    limit: number;
};

function App() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isRelatedMode, setIsRelatedMode] = useState(false);

    const { data: searchData, loading: searchLoading } = useQuery<SearchMoviesData, { query: string }>(
        SEARCH_MOVIES,
        {
            variables: { query: searchQuery },
            skip: !searchQuery || isRelatedMode,
        }
    );

    const { data: relatedData, loading: relatedLoading } = useQuery<RelatedMoviesData, RelatedMoviesVars>(
        GET_RELATED_MOVIES,
        {
            variables: {
                ids: selectedMovie ? [selectedMovie.id] : [],
                language: 'English',
                limit: 20,
            },
            skip: !selectedMovie || !isRelatedMode,
        }
    );

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setIsRelatedMode(false);
        setSelectedMovie(null);
    };

    const handleMovieClick = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    const handleShowRelated = () => {
        if (!selectedMovie) {
            return;
        }
        setIsRelatedMode(true);
    };

    const handleBackToSearch = () => {
        setIsRelatedMode(false);
    };

    const relatedMovie = useMemo(() => {
        const list = relatedData?.movies;
        if (!list || list.length === 0) {
            return null;
        }
        return list[0] ?? null;
    }, [relatedData?.movies]);

    const movies: Movie[] = useMemo(() => {
        if (isRelatedMode) {
            return relatedMovie?.similar ?? [];
        }
        return searchData?.searchMovies ?? [];
    }, [isRelatedMode, relatedMovie, searchData?.searchMovies]);

    const isLoading = isRelatedMode ? relatedLoading : searchLoading;

    const selectedMovieDetails: Movie | null = useMemo(() => {
        if (isRelatedMode) {
            if (relatedMovie) {
                return relatedMovie;
            }
            return selectedMovie;
        }
        return selectedMovie;
    }, [isRelatedMode, relatedMovie, selectedMovie]);

    const showRelatedButton = Boolean(selectedMovie) && !isRelatedMode;

    const headerLabel = isRelatedMode && selectedMovieDetails
        ? `${t('app.moviesRelatedTo')} "${selectedMovieDetails.name}"`
        : t('app.searchResults');

    return (
        <Container maxWidth="lg" className="app-container">
            <Box sx={{ my: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom className="app-title">
                    {t('app.title')}
                </Typography>

                <SearchBox onSearch={handleSearch} isLoading={isLoading} />

                <Grid container spacing={3}>
                    <Grid size={8}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                                <Typography variant="h6">
                                    {headerLabel}
                                </Typography>
                            </Box>
                            <MovieList
                                movies={movies}
                                onMovieClick={handleMovieClick}
                                isLoading={isLoading}
                            />
                        </Box>
                    </Grid>

                    <Grid size={4}>
                        <Box sx={{ position: 'sticky', top: 24, maxHeight: 'calc(100vh - 48px)', overflowY: 'auto' }}>
                            <MovieDetails
                                movie={selectedMovieDetails}
                                onBack={isRelatedMode ? handleBackToSearch : undefined}
                                onShowRelated={showRelatedButton ? handleShowRelated : undefined}
                                isRelatedMode={isRelatedMode}
                                relatedLoading={relatedLoading}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default App;
