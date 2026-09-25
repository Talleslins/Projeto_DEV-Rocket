import type { Movie } from '../types/movie';

const API_URL = 'http://localhost:8000/api/v1';

export const getMovies = async (skip: number = 0, limit: number = 20): Promise<Movie[]> => {
  // Passa os valores de skip e limit dinamicamente para o backend
  const response = await fetch(`${API_URL}/movies/?skip=${skip}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Falha na comunicação com a API');
  }
  return response.json();
};