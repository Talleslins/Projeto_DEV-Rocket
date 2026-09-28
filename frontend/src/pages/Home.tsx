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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '2rem', 
        fontSize: '2.5rem', 
        fontWeight: '800', 
        background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', 
        WebkitBackgroundClip: 'text', 
        WebkitTextFillColor: 'transparent',
        lineHeight: '1.4', /* Evita o corte no topo das letras */
        paddingTop: '0.2em'
      }}>
        Catálogo Rocket
      </h1>
      {/* Barra de Ações (Pesquisa e Novo Filme) */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '3rem', gap: '1rem', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            placeholder="Procure por um filme..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ padding: '0.85rem 1rem', width: '300px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f8fafc', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '0.85rem 1.5rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
            Pesquisar
          </button>
        </form>

        <Link to="/novo-filme" style={{ padding: '0.85rem 1.5rem', backgroundColor: '#10b981', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600' }}>
          + Adicionar Filme
        </Link>
      </div>
      
      {/* Navegação / Paginação */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
        <button onClick={handlePrev} disabled={skip === 0} style={{ padding: '0.5rem 1.5rem', borderRadius: '20px', border: '1px solid #334155', backgroundColor: skip === 0 ? '#0f172a' : '#1e293b', color: skip === 0 ? '#475569' : '#f8fafc', cursor: skip === 0 ? 'not-allowed' : 'pointer' }}>
          &larr; Anterior
        </button>
        <span style={{ fontWeight: '600', color: '#94a3b8' }}>Página {(skip / limit) + 1}</span>
        <button onClick={handleNext} disabled={movies.length < limit} style={{ padding: '0.5rem 1.5rem', borderRadius: '20px', border: '1px solid #334155', backgroundColor: movies.length < limit ? '#0f172a' : '#1e293b', color: movies.length < limit ? '#475569' : '#f8fafc', cursor: movies.length < limit ? 'not-allowed' : 'pointer' }}>
          Próximo &rarr;
        </button>
      </div>

      {/* Grelha de Filmes */}
      {movies.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.2rem', marginTop: '4rem' }}>Nenhum filme encontrado para "{searchTerm}".</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
          {movies.map(movie => (
            <Link to={`/movie/${movie.sk_movie_id}`} key={movie.sk_movie_id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s', cursor: 'pointer' }} 
                   onMouseOver={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                   onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                {movie.url_poster ? (
                  <img src={movie.url_poster} alt={movie.titulo} style={{ width: '100%', height: '330px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '330px', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                    Sem Imagem
                  </div>
                )}
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ 
                margin: '0 0 0.5rem 0', 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                lineHeight: '1.3',
                display: '-webkit-box',
                WebkitLineClamp: 2, /* Permite até 2 linhas de título */
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {movie.titulo}
              </h3>
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