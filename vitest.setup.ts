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

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      if (options && 'defaultValue' in options && typeof options.defaultValue === 'string') {
        return options.defaultValue;
      }
      return key;
    },
    i18n: {
      changeLanguage: () => Promise.resolve(),
      language: 'en',
    },
  }),
  Trans: ({ children }: { children: ReactNode }) => children,
}));
