import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchWikipediaSummary } from '../services/wikipedia';

const originalFetch = global.fetch;

const createResponse = (data: unknown, ok = true) => ({
  ok,
  json: vi.fn().mockResolvedValue(data),
}) as unknown as Response;

describe('fetchWikipediaSummary', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns summary from first matching variation', async () => {
    const summary = {
      title: 'Fight Club',
      extract: 'Soap is the yardstick of civilization.',
      content_urls: { desktop: { page: 'https://example.com/fight-club' } },
    };

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(createResponse(summary));

    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await fetchWikipediaSummary('Fight Club');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://en.wikipedia.org/api/rest_v1/page/summary/Fight%20Club',
      expect.objectContaining({ headers: { Accept: 'application/json' } })
    );
    expect(result).toEqual({
      title: 'Fight Club',
      extract: 'Soap is the yardstick of civilization.',
      url: 'https://example.com/fight-club',
    });
  });

  it('falls back to search endpoint when direct summaries missing', async () => {
    const lookupSummary = {
      title: 'Fight Club',
      extract: 'A man starts an underground club.',
      content_urls: { desktop: { page: 'https://example.com/fight-club' } },
    };

    const fetchMock = vi.fn()
      // Three direct lookups without extract/url
      .mockResolvedValueOnce(createResponse({}))
      .mockResolvedValueOnce(createResponse({}))
      .mockResolvedValueOnce(createResponse({}))
      // Search endpoint returns a hit
      .mockResolvedValueOnce(createResponse({ pages: [{ title: 'Fight Club (film)' }] }))
      // Summary for the search hit
      .mockResolvedValueOnce(createResponse(lookupSummary));

    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await fetchWikipediaSummary('Fight Club');

    expect(fetchMock).toHaveBeenCalledTimes(5);
    expect(fetchMock).toHaveBeenNthCalledWith(
      4,
      'https://en.wikipedia.org/w/rest.php/v1/search/title?q=Fight%20Club&limit=1',
      expect.objectContaining({ headers: { Accept: 'application/json' } })
    );
    expect(result).toEqual({
      title: 'Fight Club',
      extract: 'A man starts an underground club.',
      url: 'https://example.com/fight-club',
    });
  });

  it('returns null and logs error when fetch throws', async () => {
    const error = new Error('network failure');
    const fetchMock = vi.fn().mockRejectedValue(error);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await fetchWikipediaSummary('Fight Club');

    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith('Error fetching Wikipedia summary:', error);
  });
});
