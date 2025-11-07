import { gql } from '@apollo/client';

export const SEARCH_MOVIES = gql`
  query SearchMovies($query: String!) {
    searchMovies(query: $query) {
      id
      name
      overview
      releaseDate
      score
      genres { id name }
      poster {
        small
      }
      runtime
      tagline
      votes
      adult
    }
  }
`;

export const GET_RELATED_MOVIES = gql`
  query MoviesWithSimilar($ids: [ID!]!, $language: Translations = English, $limit: Int = 20) {
    movies(ids: $ids, language: $language) {
      id
      name
      tagline
      overview
      releaseDate
      score
      runtime
      status
      genres { id name }
      languages { name }
      votes
      adult
      poster {
        small
        large
      }
      backdrop {
        large
      }
      similar(language: $language, limit: $limit) {
        id
        name
        overview
        releaseDate
        score
        runtime
        tagline
        adult
        genres { id name }
        poster {
          small
        }
      }
    }
  }
`;