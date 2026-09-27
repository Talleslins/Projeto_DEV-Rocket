import type { Movie, MovieDetail, Review, ReviewCreate, MovieCreate, MovieUpdate } from '../types/movie';

const API_URL = 'http://localhost:8000/api/v1';

export const getMovies = async (skip: number = 0, limit: number = 20, title: string = ''): Promise<Movie[]> => {
  // Constroi a URL base
  let url = `${API_URL}/movies/?skip=${skip}&limit=${limit}`;
  
  // Se houver texto na busca, adiciona à URL
  if (title) {
    url += `&title=${encodeURIComponent(title)}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Falha na comunicação com a API');
  }
  return response.json();
};

export const getMovieDetails = async (id: string): Promise<MovieDetail> => {
  const response = await fetch(`${API_URL}/movies/${id}`);
  if (!response.ok) {
    throw new Error('Falha ao procurar os detalhes do filme');
  }
  return response.json();
};

export const getMovieReviews = async (id: string): Promise<Review[]> => {
  const response = await fetch(`${API_URL}/movies/${id}/reviews`);
  if (!response.ok) {
    throw new Error('Falha ao buscar as avaliações');
  }
  return response.json();
};

export const createMovieReview = async (id: string, review: ReviewCreate): Promise<Review> => {
  const response = await fetch(`${API_URL}/movies/${id}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(review),
  });
  if (!response.ok) {
    throw new Error('Falha ao enviar a avaliação');
  }
  return response.json();
};3

export const createMovie = async (movie: MovieCreate): Promise<MovieDetail> => {
  const response = await fetch(`${API_URL}/movies/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  if (!response.ok) throw new Error('Falha ao criar o filme');
  return response.json();
};

export const updateMovie = async (id: string, movie: MovieUpdate): Promise<MovieDetail> => {
  const response = await fetch(`${API_URL}/movies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  if (!response.ok) throw new Error('Falha ao atualizar o filme');
  return response.json();
};

export const deleteMovie = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/movies/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Falha ao apagar o filme');
};