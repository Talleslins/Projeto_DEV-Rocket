import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMovies } from '../services/api';
import type { Movie } from '../types/movie';

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [skip, setSkip] = useState(0);
  const limit = 20;
  
  // Estados para a barra de pesquisa
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    //passa o searchTerm para a API
    getMovies(skip, limit, searchTerm).then(data => setMovies(data));
  }, [skip, searchTerm]);

  const handleNext = () => setSkip(prev => prev + limit);
  const handlePrev = () => setSkip(prev => Math.max(0, prev - limit));

  // Função disparada ao submeter a pesquisa
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setSkip(0); // Volta para a página 1 ao pesquisar
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Catálogo de Filmes</h1>

      {/* Barra de Pesquisa */}
      {/* Barra de Ações (Pesquisa e Novo Filme) */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            placeholder="Procure por um filme..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ padding: '0.75rem', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Pesquisar
          </button>
        </form>

        <Link to="/novo-filme" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          + Adicionar Filme
        </Link>
      </div>
      
      {/* Navegação / Paginação */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
        <button onClick={handlePrev} disabled={skip === 0} style={{ padding: '0.5rem 1rem', cursor: skip === 0 ? 'not-allowed' : 'pointer' }}>
          Anterior
        </button>
        <span style={{ fontWeight: 'bold' }}>Página {(skip / limit) + 1}</span>
        <button onClick={handleNext} disabled={movies.length < limit} style={{ padding: '0.5rem 1rem', cursor: movies.length < limit ? 'not-allowed' : 'pointer' }}>
          Próximo
        </button>
      </div>

      {/* Grelha de Filmes */}
      {movies.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Nenhum filme encontrado para "{searchTerm}".</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
          {movies.map(movie => (
            <Link to={`/movie/${movie.sk_movie_id}`} key={movie.sk_movie_id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer' }} 
                   onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                   onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                {movie.url_poster ? (
                  <img src={movie.url_poster} alt={movie.titulo} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '300px', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Sem Imagem
                  </div>
                )}
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{movie.titulo}</h3>
                  <p style={{ margin: 0, color: '#666' }}>{movie.ano_lancamento}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;