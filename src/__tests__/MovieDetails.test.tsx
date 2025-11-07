import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../services/wikipedia', () => ({
  fetchWikipediaSummary: vi.fn().mockResolvedValue({
    title: 'Fight Club',
    extract: 'Soap is the yardstick of civilization.',
    url: 'https://example.com/fight-club'
  }),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieDetails from '../components/MovieDetails';
import type { Movie } from '../types';
import { fetchWikipediaSummary } from '../services/wikipedia';

const mockedFetch = vi.mocked(fetchWikipediaSummary);

afterEach(() => {
  vi.clearAllMocks();
});

const baseMovie: Movie = {
  id: 'movie-1',
  name: 'Fight Club',
  overview: 'A depressed man joins an underground club.',
  tagline: 'Mischief. Mayhem. Soap.',
  releaseDate: '1999-10-15T00:00:00Z',
  runtime: 139,
  score: 8.6,
  genres: [{ id: 'genre-1', name: 'Drama' }],
  languages: [{ name: 'English' }],
  country: [],
  status: 'RELEASED',
  votes: 1000,
  poster: { small: 'poster.jpg', large: 'poster-large.jpg' },
  backdrop: { large: 'backdrop.jpg' },
  adult: false,
  similar: [],
  popularity: 9,
  homepage: undefined,
  budget: undefined,
  revenue: undefined,
};

describe('MovieDetails', () => {
  it('renders placeholder when no movie is selected', () => {
    render(<MovieDetails movie={null} />);
    expect(screen.getByText('Select a movie to see details')).toBeInTheDocument();
  });

  it('renders movie details and handles actions', async () => {
    const onBack = vi.fn();
    const onShowRelated = vi.fn();

    render(
      <MovieDetails
        movie={baseMovie}
        onBack={onBack}
        onShowRelated={onShowRelated}
        relatedLoading={false}
      />
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Fight Club' })).toBeInTheDocument();
    expect(screen.getByText('"Mischief. Mayhem. Soap."')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back to Results' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Back to Results' }));
    expect(onBack).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: 'Related' }));
    expect(onShowRelated).toHaveBeenCalledTimes(1);

    expect(mockedFetch).toHaveBeenCalledWith('Fight Club');
    expect(await screen.findByText('Soap is the yardstick of civilization.')).toBeInTheDocument();
  });

  it('hides related button in related mode', () => {
    render(
      <MovieDetails
        movie={baseMovie}
        isRelatedMode
        onShowRelated={vi.fn()}
      />
    );

    expect(screen.queryByRole('button', { name: 'movieDetails.showRelated' })).not.toBeInTheDocument();
  });
});
