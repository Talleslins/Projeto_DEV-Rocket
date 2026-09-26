import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails } from '../services/api';
import type { MovieDetail } from '../types/movie';

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getMovieDetails(id)
        .then(data => setMovie(data))
        .catch(() => setError('Não foi possível carregar os detalhes do filme.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>A carregar...</div>;
  if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!movie) return <div style={{ padding: '2rem', textAlign: 'center' }}>Filme não encontrado.</div>;

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Banner Superior com Backdrop */}
      <div style={{ 
        width: '100%', 
        height: '400px', 
        backgroundColor: '#1a1a1a',
        backgroundImage: movie.url_backdrop ? `url(${movie.url_backdrop})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' }} />
        
        <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'flex-end', height: '100%', boxSizing: 'border-box' }}>
          {movie.url_poster && (
            <img 
              src={movie.url_poster} 
              alt={movie.titulo} 
              style={{ width: '200px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', transform: 'translateY(40px)' }} 
            />
          )}
          <div style={{ color: 'white', paddingBottom: '1rem' }}>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>{movie.titulo} ({movie.ano_lancamento})</h1>
            <p style={{ margin: 0, fontSize: '1.1rem', color: '#ccc' }}>
              {movie.data_lancamento} • {movie.duracao_minutos ? `${movie.duracao_minutos} min` : 'Duração desconhecida'} • {movie.status_filme}
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div style={{ maxWidth: '1200px', margin: '40px auto 0', padding: '2rem' }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
          &larr; Voltar ao Catálogo
        </Link>
        
        <div style={{ marginLeft: movie.url_poster ? '232px' : '0' }}>
          <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Sinopse</h2>
          <p style={{ lineHeight: '1.6', fontSize: '1.1rem', color: '#333' }}>
            {movie.sinopse || 'Nenhuma sinopse disponível para este filme.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;