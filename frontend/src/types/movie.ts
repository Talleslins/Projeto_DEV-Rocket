export interface Movie {
  sk_movie_id: string;
  titulo: string;
  ano_lancamento: number | null;
  url_poster: string | null;
}

export interface MovieDetail extends Movie {
  sinopse: string | null;
  duracao_minutos: number | null;
  status_filme: string | null;
  data_lancamento: string | null;
  url_backdrop: string | null;
  nota_media_base?: number;
  qtd_avaliacoes_base?: number;
}

export interface Review {
  id?: number | string;
  sk_movie_id: string;
  rating: number;
  review_text: string | null;
}

export interface ReviewCreate {
  rating: number;
  review_text: string;
}

export interface MovieCreate {
  titulo: string;
  sinopse?: string | null;
  duracao_minutos?: number | null;
  status_filme?: string | null;
  data_lancamento?: string | null;
  ano_lancamento?: number | null;
  url_poster?: string | null;
  url_backdrop?: string | null;
}

export type MovieUpdate = Partial<MovieCreate>;