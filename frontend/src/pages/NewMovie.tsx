import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createMovie } from '../services/api';

function NewMovie() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: '',
    sinopse: '',
    data_lancamento: '', // <- Novo estado para a data completa
    ano_lancamento: '',
    duracao_minutos: '',
    url_poster: '',
    url_backdrop: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      
      if (name === 'data_lancamento' && value) {
       
        newData.ano_lancamento = value.substring(0, 4);
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createMovie({
        titulo: formData.titulo,
        sinopse: formData.sinopse || null,
        data_lancamento: formData.data_lancamento || null, // <- Enviado para o backend
        ano_lancamento: formData.ano_lancamento ? Number(formData.ano_lancamento) : null,
        duracao_minutos: formData.duracao_minutos ? Number(formData.duracao_minutos) : null,
        url_poster: formData.url_poster || null,
        url_backdrop: formData.url_backdrop || null,
        status_filme: 'Lançado',
      });
      alert('Filme adicionado com sucesso!');
      navigate('/'); 
    } catch (error) {
      alert('Erro ao criar filme. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = { width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' as const };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginBottom: '2rem' }}>
        &larr; Voltar ao Catálogo
      </Link>
      
      <h1 style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '2rem' }}>Adicionar Novo Filme</h1>
      
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#f9f9f9', padding: '2rem', borderRadius: '8px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Título do Filme *</label>
        <input type="text" name="titulo" required value={formData.titulo} onChange={handleChange} style={inputStyle} placeholder="Ex: O Senhor dos Anéis" />

        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* Novo input de Calendário (type="date") */}
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Data de Lançamento</label>
            <input type="date" name="data_lancamento" value={formData.data_lancamento} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Ano de Lançamento</label>
            <input 
              type="number" 
              name="ano_lancamento" 
              min="1888" 
              value={formData.ano_lancamento} 
              onChange={handleChange} 
              // Bloqueia o campo se a data estiver preenchida
              readOnly={!!formData.data_lancamento}
              style={{
                ...inputStyle, 
                // Muda a cor e o cursor para dar a sensação visual de bloqueado
                backgroundColor: formData.data_lancamento ? '#e9ecef' : 'white',
                cursor: formData.data_lancamento ? 'not-allowed' : 'text'
              }} 
              placeholder="Ex: 2001" 
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Duração (minutos)</label>
            {/* Limitado com min="0" para não aceitar negativos */}
            <input type="number" name="duracao_minutos" min="0" value={formData.duracao_minutos} onChange={handleChange} style={inputStyle} placeholder="Ex: 178" />
          </div>
        </div>

        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>URL do Poster (Capa)</label>
        <input type="url" name="url_poster" value={formData.url_poster} onChange={handleChange} style={inputStyle} placeholder="https://link-da-imagem.com/poster.jpg" />

        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>URL do Backdrop (Fundo)</label>
        <input type="url" name="url_backdrop" value={formData.url_backdrop} onChange={handleChange} style={inputStyle} placeholder="https://link-da-imagem.com/fundo.jpg" />

        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Sinopse</label>
        <textarea name="sinopse" value={formData.sinopse} onChange={handleChange} style={{ ...inputStyle, minHeight: '150px' }} placeholder="Escreva um breve resumo do filme..." />

        <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '1rem' }}>
          {isSubmitting ? 'A guardar...' : 'Guardar Filme'}
        </button>
      </form>
    </div>
  );
}

export default NewMovie;