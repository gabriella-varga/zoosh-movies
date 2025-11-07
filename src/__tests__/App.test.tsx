import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import type { Movie } from '../types';
import { SEARCH_MOVIES, GET_RELATED_MOVIES } from '../graphql/queries';

const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock('@apollo/client/react', async () => {
  const actual = await vi.importActual<typeof import('@apollo/client/react')>('@apollo/client/react');
  return {
    ...actual,
    useQuery: mockUseQuery,
  };
});

describe('App integration flow', () => {
  const baseMovie: Movie = {
    id: '1',
    name: 'Fight Club',
    overview: 'Overview',
    score: 8.5,
    tagline: 'Mischief. Mayhem. Soap.',
    genres: [{ id: 'genre-1', name: 'Drama' }],
    poster: { small: 'poster-small.jpg', large: 'poster-large.jpg' },
    releaseDate: '1999-10-15T00:00:00Z',
    runtime: 139,
    languages: [{ name: 'English' }],
    country: [],
    status: 'RELEASED',
    votes: 1000,
    adult: false,
  };

  const relatedMovie: Movie = {
    ...baseMovie,
    id: '2',
    name: 'Similar Movie',
  };

  beforeEach(() => {
    mockUseQuery.mockReset();
    mockUseQuery.mockImplementation((query: unknown, options?: { skip?: boolean }) => {
      if (query === SEARCH_MOVIES) {
        if (options?.skip) {
          return { data: undefined, loading: false };
        }
        return { data: { searchMovies: [baseMovie] }, loading: false };
      }

      if (query === GET_RELATED_MOVIES) {
        if (options?.skip) {
          return { data: undefined, loading: false };
        }
        return {
          data: {
            movies: [{ ...baseMovie, similar: [relatedMovie] }],
          },
          loading: false,
        };
      }

      return { data: undefined, loading: false };
    });
  });

  afterEach(() => {
    mockUseQuery.mockReset();
  });

  it('renders search results and switches to related mode', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText('Search for movies...');
    await userEvent.type(input, 'Fight Club');
    fireEvent.submit(input.closest('form')!);

    const list = await screen.findByRole('list');
    await waitFor(() => expect(within(list).getByText('Fight Club')).toBeInTheDocument());

    await userEvent.click(within(list).getByText('Fight Club'));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Related' })).toBeEnabled());
    await userEvent.click(screen.getByRole('button', { name: 'Related' }));

    await waitFor(() => expect(screen.getByText('Similar Movie')).toBeInTheDocument());
    expect(screen.getByText('Movies related to "Fight Club"')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Back to Results' }));
    await waitFor(() => expect(within(list).getByText('Fight Club')).toBeInTheDocument());
  });
});
