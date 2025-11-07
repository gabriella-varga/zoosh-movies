import { useState } from 'react';
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

type RelatedMoviesData = {
    movie: Movie;
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

    const { data: relatedData, loading: relatedLoading } = useQuery<RelatedMoviesData, { id: string }>(
        GET_RELATED_MOVIES,
        {
            variables: { id: selectedMovie?.id || '' },
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

    const handleBackToSearch = () => {
        setIsRelatedMode(false);
        setSelectedMovie(null);
    };

    // explicitly type movies so TS knows it's a Movie[]
    const movies: Movie[] = isRelatedMode
        ? (relatedData?.movie ? [relatedData.movie] : [])
        : (searchData?.searchMovies ?? []);

    const isLoading = isRelatedMode ? relatedLoading : searchLoading;

    return (
        <Container maxWidth="lg" className="app-container">
            <Box sx={{ my: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom className="app-title">
                    {t('app.title')}
                </Typography>

                <SearchBox onSearch={handleSearch} isLoading={isLoading} />

                <Grid container spacing={3}>
                    <Grid size={8}>
                        <Box className="movies-section">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6">
                                    {isRelatedMode && selectedMovie
                                        ? `${t('app.moviesRelatedTo')} "${selectedMovie.name}"`
                                        : t('app.searchResults')}
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
                        <MovieDetails
                            movie={selectedMovie}
                            onBack={selectedMovie ? handleBackToSearch : undefined}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default App;
