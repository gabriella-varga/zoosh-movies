export interface WikipediaPage {
    title: string;
    extract: string;
    url: string;
}

export interface Genre {
    id: string;
    name: string;
}

export interface Country {
    id: string;
    name: string;
}

export interface Language {
    id: string;
    name: string;
}

export type ReleaseStatus = 'RELEASED' | 'RUMORED' | 'POST_PRODUCTION' | 'IN_PRODUCTION' | 'PLANNED' | 'CANCELED';

export interface Poster {
    small?: string | null;
    medium?: string | null;
    large?: string | null;
}

export interface Backdrop {
    small?: string | null;
    medium?: string | null;
    large?: string | null;
}

export type Movie = {
    id: string;
    name: string;
    tagline?: string | null;
    overview: string;
    country?: Country[];
    languages?: Language[];
    status?: ReleaseStatus;
    genres?: Genre[];
    releaseDate?: string | null;
    runtime?: number | null;
    budget?: number | null;
    revenue?: string | null;
    adult?: boolean | null;
    homepage?: string | null;
    popularity?: number | null;
    score?: number | null;
    votes?: number | null;
    poster?: Poster | null;
    backdrop?: Backdrop | null;
};

