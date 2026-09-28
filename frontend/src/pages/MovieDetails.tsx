import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMovieDetails, getMovieReviews, createMovieReview, deleteMovie } from '../services/api';
import type { MovieDetail, Review } from '../types/movie';

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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

  const handleDeleteMovie = async () => {
    if (!id) return;
    const confirmDelete = window.confirm("Tem a certeza que deseja apagar este filme? Esta ação não pode ser desfeita.");
    if (confirmDelete) {
      try {
        await deleteMovie(id);
        alert("Filme apagado com sucesso!");
        navigate('/');
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

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#f8fafc' }}>A carregar...</div>;
  if (!movie) return <div style={{ padding: '2rem', textAlign: 'center', color: '#f8fafc' }}>Filme não encontrado.</div>;

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <div style={{ 
        width: '100%', height: '50vh', minHeight: '400px', backgroundColor: '#0f172a',
        backgroundImage: movie.url_backdrop ? `url(${movie.url_backdrop})` : 'none',
        backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, #0f172a 0%, rgba(15, 23, 42, 0.4) 100%)' }} />
        
        <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '2rem', display: 'flex', gap: '2.5rem', alignItems: 'center', height: '100%', boxSizing: 'border-box' }}>
          {movie.url_poster && (
            <img src={movie.url_poster} alt={movie.titulo} style={{ width: '220px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', border: '1px solid #334155' }} />
          )}
          <div style={{ paddingBottom: '1rem' }}>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '3rem', fontWeight: '800', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{movie.titulo} <span style={{ fontWeight: '400', color: '#cbd5e1' }}>({movie.ano_lancamento})</span></h1>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#cbd5e1' }}>
              {movie.data_lancamento} • {movie.duracao_minutos ? `${movie.duracao_minutos} min` : 'Duração desconhecida'} • <span style={{ backgroundColor: '#1e293b', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.9rem', border: '1px solid #334155' }}>{movie.status_filme}</span>
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
              <span style={{ fontSize: '1.8rem', color: '#eab308' }}>★</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{averageRating}</span>
              <span style={{ color: '#94a3b8', fontSize: '1rem', marginLeft: '0.5rem' }}>({totalAvaliacoes} avaliações)</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto 0', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <Link to="/" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            &larr; Voltar ao Catálogo
          </Link>
          
          <button onClick={handleDeleteMovie} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#e11d48', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Apagar Filme
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          <section>
            <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem', color: '#f8fafc' }}>Sinopse</h2>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#cbd5e1' }}>
              {movie.sinopse || 'Nenhuma sinopse disponível para este filme.'}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem', marginBottom: '2rem', color: '#f8fafc' }}>Avaliações</h2>
            
            <form onSubmit={handleSubmitReview} style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', marginBottom: '3rem', border: '1px solid #334155' }}>
              <h3 style={{ marginTop: 0, fontSize: '1.2rem', color: '#f8fafc', marginBottom: '1.5rem' }}>Deixe a sua opinião</h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <label style={{ fontWeight: '600', color: '#cbd5e1' }}>Nota (0-10):</label>
                <input 
                  type="number" min="0" max="10" step="0.5" required
                  value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}
                  style={{ padding: '0.75rem', width: '80px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', outline: 'none' }}
                />
              </div>
              <textarea 
                placeholder="Escreva a sua resenha sobre o filme..." required
                value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', minHeight: '120px', marginBottom: '1.5rem', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }}
              />
              <button type="submit" disabled={isSubmitting} style={{ padding: '0.85rem 2rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: '600' }}>
                {isSubmitting ? 'A enviar...' : 'Publicar Avaliação'}
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {reviews.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px dashed #334155' }}>Ainda não existem resenhas de utilizadores. Seja o primeiro!</p>
              ) : (
                reviews.map((review, index) => (
                  <div key={index} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ color: '#eab308', fontSize: '1.2rem' }}>★</span>
                      <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{review.rating.toFixed(1)}</span>
                    </div>
                    <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.7' }}>{review.review_text}</p>
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