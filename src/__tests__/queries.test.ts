import { describe, it, expect } from 'vitest';
import { print, Kind } from 'graphql';
import { SEARCH_MOVIES, GET_RELATED_MOVIES } from '../graphql/queries';

describe('GraphQL queries', () => {
  it('SEARCH_MOVIES has expected structure', () => {
    const printed = print(SEARCH_MOVIES);

    expect(printed).toContain('query SearchMovies');
    expect(printed).toContain('searchMovies');
    expect(printed).toContain('poster');

    const operation = SEARCH_MOVIES.definitions.find(
      (def): def is Extract<typeof def, { kind: typeof Kind.OPERATION_DEFINITION }> =>
        def.kind === Kind.OPERATION_DEFINITION
    );

    expect(operation?.operation).toBe('query');
    expect(operation?.variableDefinitions?.[0]?.variable.name.value).toBe('query');
  });

  it('GET_RELATED_MOVIES requests movie and similar list', () => {
    const printed = print(GET_RELATED_MOVIES);

    expect(printed).toContain('query MoviesWithSimilar');
    expect(printed).toContain('movies');
    expect(printed).toContain('similar');

    const operation = GET_RELATED_MOVIES.definitions.find(
      (def): def is Extract<typeof def, { kind: typeof Kind.OPERATION_DEFINITION }> =>
        def.kind === Kind.OPERATION_DEFINITION
    );

    expect(operation?.operation).toBe('query');
    const variables = operation?.variableDefinitions?.map((def) => def.variable.name.value);
    expect(variables).toEqual(expect.arrayContaining(['ids', 'language', 'limit']));
  });
});
