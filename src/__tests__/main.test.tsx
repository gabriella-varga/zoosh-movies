import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ReactNode } from 'react';

const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));

vi.mock('react-dom/client', () => ({
  createRoot: createRootMock,
}));

const ApolloClientConfig: any[] = [];

class ApolloClient {
  constructor(config: unknown) {
    ApolloClientConfig.push(config);
  }
}

class HttpLink {
  public config: unknown;
  constructor(config: unknown) {
    this.config = config;
  }
}

class InMemoryCache {}

vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual<typeof import('@apollo/client')>('@apollo/client');
  return {
    ...actual,
    ApolloClient,
    HttpLink,
    InMemoryCache,
  };
});

vi.mock('@apollo/client/react', async () => {
  const actual = await vi.importActual<typeof import('@apollo/client/react')>('@apollo/client/react');
  return {
    ...actual,
    ApolloProvider: ({ children }: { children: ReactNode }) => <div data-testid="apollo-mock">{children}</div>,
  };
});

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual<typeof import('@mui/material')>('@mui/material');
  return {
    ...actual,
    ThemeProvider: ({ children }: { children: ReactNode }) => <div data-testid="theme-mock">{children}</div>,
    CssBaseline: () => <div data-testid="baseline-mock" />,
  };
});

describe('main entry', () => {
  beforeEach(() => {
    ApolloClientConfig.length = 0;
    createRootMock.mockClear().mockImplementation(() => ({ render: renderMock }));
    renderMock.mockClear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.resetModules();
  });

  it('initializes Apollo client and renders App tree', async () => {
    const rootEl = document.createElement('div');
    rootEl.id = 'root';
    document.body.appendChild(rootEl);

    await import('../main');

    expect(createRootMock).toHaveBeenCalledWith(rootEl);
    expect(renderMock).toHaveBeenCalledTimes(1);

    expect(ApolloClientConfig[0]).toMatchObject({
      link: expect.any(HttpLink),
      cache: expect.any(InMemoryCache),
    });
  });
});
