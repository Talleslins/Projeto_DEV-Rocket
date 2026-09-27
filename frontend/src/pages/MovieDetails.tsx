import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMovieDetails, getMovieReviews, createMovieReview, deleteMovie } from '../services/api';
import type { MovieDetail, Review } from '../types/movie';

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // Hook para redirecionar o utilizador
  
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newRating, setNewRating] = useState<number>(10);
  const [newReviewText, setNewReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([getMovieDetails(id), getMovieReviews(id)])
        .then(([movieData, reviewsData]) => {
          setMovie(movieData);
          setReviews(reviewsData);
        })
        .catch(error => console.error("Erro ao carregar dados:", error))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSubmitting(true);
    try {
      const addedReview = await createMovieReview(id, {
        rating: newRating,
        review_text: newReviewText
      });
      setReviews(prev => [...prev, addedReview]);
      setNewReviewText('');
      setNewRating(10);
    } catch (error) {
      alert("Erro ao enviar avaliação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para apagar o filme
  const handleDeleteMovie = async () => {
    if (!id) return;
    
    // Pede confirmação antes de apagar
    const confirmDelete = window.confirm("Tem a certeza que deseja apagar este filme? Esta ação não pode ser desfeita.");
    
    if (confirmDelete) {
      try {
        await deleteMovie(id);
        alert("Filme apagado com sucesso!");
        navigate('/'); // Redireciona para o catálogo (Home)
      } catch (error) {
        alert("Erro ao apagar o filme. Tente novamente.");
      }
    }
  };

  const qtdAntiga = movie?.qtd_avaliacoes_base || 0;
  const mediaAntiga = movie?.nota_media_base || 0;
  const somaAntiga = qtdAntiga * mediaAntiga;

  const qtdNova = reviews.length;
  const somaNova = reviews.reduce((acc, curr) => acc + curr.rating, 0);

  const totalAvaliacoes = qtdAntiga + qtdNova;
  
  const averageRating = totalAvaliacoes > 0 
    ? ((somaAntiga + somaNova) / totalAvaliacoes).toFixed(1)
    : 'Sem avaliações';

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>A carregar...</div>;
  if (!movie) return <div style={{ padding: '2rem', textAlign: 'center' }}>Filme não encontrado.</div>;

  return (
    <div style={{ fontFamily: 'sans-serif', paddingBottom: '4rem' }}>
      <div style={{ 
        width: '100%', height: '400px', backgroundColor: '#1a1a1a',
        backgroundImage: movie.url_backdrop ? `url(${movie.url_backdrop})` : 'none',
        backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' }} />
        <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'flex-end', height: '100%', boxSizing: 'border-box' }}>
          {movie.url_poster && (
            <img src={movie.url_poster} alt={movie.titulo} style={{ width: '200px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', transform: 'translateY(40px)' }} />
          )}
          <div style={{ color: 'white', paddingBottom: '1rem' }}>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>{movie.titulo} ({movie.ano_lancamento})</h1>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#ccc' }}>
              {movie.data_lancamento} • {movie.duracao_minutos ? `${movie.duracao_minutos} min` : 'Duração desconhecida'} • {movie.status_filme}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <span style={{ fontSize: '1.5rem', color: '#f5c518' }}>★</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{averageRating}</span>
              <span style={{ color: '#ccc' }}>({totalAvaliacoes} avaliações)</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '40px auto 0', padding: '2rem' }}>
        
        {/* Barra de Navegação e Ações */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
            &larr; Voltar ao Catálogo
          </Link>
          
          {/* Botão de Apagar Filme */}
          <button 
            onClick={handleDeleteMovie} 
            style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Apagar Filme
          </button>
        </div>
        
        <div style={{ marginLeft: movie.url_poster ? '232px' : '0', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <section>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Sinopse</h2>
            <p style={{ lineHeight: '1.6', fontSize: '1.1rem', color: '#333' }}>
              {movie.sinopse || 'Nenhuma sinopse disponível para este filme.'}
            </p>
          </section>

          <section>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Avaliações</h2>
            
            <form onSubmit={handleSubmitReview} style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>Adicionar uma Avaliação</h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <label style={{ fontWeight: 'bold' }}>Nota (0-10):</label>
                <input 
                  type="number" min="0" max="10" step="0.5" required
                  value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}
                  style={{ padding: '0.5rem', width: '80px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
              <textarea 
                placeholder="Escreva a sua resenha..." required
                value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px', marginBottom: '1rem', boxSizing: 'border-box' }}
              />
              <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                {isSubmitting ? 'A enviar...' : 'Enviar Avaliação'}
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviews.length === 0 ? (
                <p style={{ color: '#666' }}>As avaliações base não contêm texto. Adicione a primeira resenha!</p>
              ) : (
                reviews.map((review, index) => (
                  <div key={index} style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#f5c518', fontSize: '1.2rem' }}>★</span>
                      <span style={{ fontWeight: 'bold' }}>{review.rating.toFixed(1)}</span>
                    </div>
                    <p style={{ margin: 0, color: '#444', lineHeight: '1.5' }}>{review.review_text}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;