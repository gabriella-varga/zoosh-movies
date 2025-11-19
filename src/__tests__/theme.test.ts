import { describe, it, expect } from 'vitest';
import theme, { COLORS } from '../theme';

describe('theme configuration', () => {
  it('exposes color tokens', () => {
    expect(COLORS.primary).toBe('#FFB300');
    expect(COLORS.background.default).toBe('#121212');
    expect(COLORS.text.primary).toBe('#E0E0E0');
  });

  it('disables typography margins', () => {
    expect(theme.typography?.overline).toMatchObject({ marginBottom: 0 });
  });
});
