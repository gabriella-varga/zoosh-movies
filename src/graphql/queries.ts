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
    }
  }
`;

export const GET_RELATED_MOVIES = gql`
  query MovieDetailsWithSimilar($id: ID!) {
    movie(id: $id) {
      id
      name
      overview
      releaseDate
      score
      genres { id name }
      poster {
        large
      }
      backdrop {
        large
      }
    }
  }
`;