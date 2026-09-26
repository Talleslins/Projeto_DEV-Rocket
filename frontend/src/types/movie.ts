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
}