import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMovies } from '../services/api';
import type { Movie } from '../types/movie';

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    const skip = (page - 1) * limit;
    
    getMovies(skip, limit)
      .then(data => setMovies(data))
      .catch(error => console.error(error));
  }, [page]);

  const handleNext = () => setPage(prev => prev + 1);
  const handlePrev = () => setPage(prev => Math.max(prev - 1, 1));

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Catálogo de Filmes</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {movies.map((movie) => (
          <Link 
            to={`/movie/${movie.sk_movie_id}`} 
            key={movie.sk_movie_id} 
            style={{ textDecoration: 'none', color: 'inherit', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {movie.url_poster ? (
              <img src={movie.url_poster} alt={`Pôster de ${movie.titulo}`} style={{ width: '100%', borderRadius: '4px', marginBottom: '1rem' }} />
            ) : (
              <div style={{ width: '100%', height: '300px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                Sem Imagem
              </div>
            )}
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>{movie.titulo}</h3>
            <p style={{ color: '#666', margin: 'auto 0 0 0' }}>{movie.ano_lancamento || 'Ano desconhecido'}</p>
          </Link>
        ))}
      </div>

      {/* Controlos de Paginação */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={handlePrev} 
          disabled={page === 1}
          style={{ padding: '0.5rem 1rem', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
        >
          Anterior
        </button>
        
        <span style={{ fontWeight: 'bold' }}>Página {page}</span>
        
        <button 
          onClick={handleNext} 
          disabled={movies.length < limit}
          style={{ padding: '0.5rem 1rem', cursor: movies.length < limit ? 'not-allowed' : 'pointer' }}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}

export default Home;