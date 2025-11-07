import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import type { ReactNode } from 'react';

afterEach(() => {
  cleanup();
});

(globalThis as any).__vite_ssr_exportAll__ = (mod: Record<string, unknown>, target: Record<string, unknown>) => {
  if (mod && target) {
    Object.keys(mod).forEach((key) => {
      if (key !== 'default' && !(key in target)) {
        target[key] = mod[key];
      }
    });
  }
  return mod;
};
(globalThis as any).__vite_ssr_exportName__ = (_name: string, value: unknown) => value;

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual<typeof import('react-i18next')>('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, options?: Record<string, unknown>) => {
        const translations: Record<string, string> = {
          'app.title': 'Movie Finder',
          'app.searchResults': 'Search Results',
          'app.moviesRelatedTo': 'Movies related to',
          'movieDetails.backToResults': 'Back to Results',
          'movieDetails.showRelated': 'Related',
          'movieDetails.selectMovie': 'Select a movie to see details',
          'movieDetails.rating': 'Rating',
          'movieDetails.details': 'Details',
          'movieList.noMoviesFound': 'No movies found. Try a different search query.',
          'search.placeholder': 'Search for movies...',
          'search.button': 'Search',
          'search.searching': 'Searching...',
          'movieList.adultContent': '18+',
          'movieList.minutes': 'min',
        };

        if (options && 'defaultValue' in options && typeof options.defaultValue === 'string') {
          return options.defaultValue;
        }
        return translations[key] ?? key;
      },
      i18n: {
        changeLanguage: () => Promise.resolve(),
        language: 'en',
      },
    }),
  };
});
