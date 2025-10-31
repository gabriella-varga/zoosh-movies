export interface WikipediaPage {
    title: string;
    extract: string;
    url: string;
}

export type Movie = {
    id: string;
    name: string;
    overview?: string | null;
    releaseDate?: string | null;
    score?: number | null;
    genres?: { id: string; name: string }[];
};