import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it, vi } from 'vitest';
import MovieList from '../components/MovieList';
import type { Movie } from '../types';

const createMovie = (overrides: Partial<Movie> = {}): Movie => ({
  id: 'movie-1',
  name: 'Test Movie',
  overview: 'Overview',
  releaseDate: '1999-10-15T00:00:00Z',
  score: 8.5,
  genres: [{ id: 'genre-1', name: 'Drama' }],
  tagline: 'Mischief. Mayhem. Soap.',
  runtime: 139,
  poster: { small: 'poster.jpg' },
  adult: false,
  languages: [{ name: 'English' }],
  country: [],
  status: 'RELEASED',
  votes: 1000,
  backdrop: undefined,
  similar: undefined,
  popularity: undefined,
  homepage: undefined,
  budget: undefined,
  revenue: undefined,
  ...overrides,
});

describe('MovieList', () => {
  it('shows loader when loading', () => {
    render(<MovieList movies={[]} onMovieClick={vi.fn()} isLoading />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows empty state when no movies', () => {
    render(<MovieList movies={[]} onMovieClick={vi.fn()} />);
    expect(screen.getByRole('alert')).toHaveTextContent('No movies found. Try a different search query.');
  });

  it('renders movies and handles click', async () => {
    const onMovieClick = vi.fn();
    const movie = createMovie({ id: 'm1', name: 'Fight Club' });
    render(<MovieList movies={[movie]} onMovieClick={onMovieClick} />);

    expect(screen.getByText('Fight Club')).toBeInTheDocument();
    expect(screen.getByText('"Mischief. Mayhem. Soap."')).toBeInTheDocument();
    expect(screen.getByText(/139\s+min/i)).toBeInTheDocument();

    await userEvent.click(screen.getByText('Fight Club'));

    expect(onMovieClick).toHaveBeenCalledTimes(1);
    expect(onMovieClick).toHaveBeenCalledWith(movie);
  });
});
