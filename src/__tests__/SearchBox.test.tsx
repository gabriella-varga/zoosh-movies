import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it, vi } from 'vitest';
import SearchBox from '../components/SearchBox';

describe('SearchBox', () => {
  it('submits trimmed query', async () => {
    const onSearch = vi.fn();
    render(<SearchBox onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('search.placeholder');
    await userEvent.type(input, '  Fight Club  ');

    const form = input.closest('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('Fight Club');
  });

  it('disables input and button while loading', () => {
    const onSearch = vi.fn();
    render(<SearchBox onSearch={onSearch} isLoading />);

    const input = screen.getByPlaceholderText('search.placeholder');
    const button = screen.getByRole('button', { name: 'search.searching' });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
});
