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

const inputStyle = { 
    width: '100%', padding: '0.85rem', marginBottom: '1.5rem', borderRadius: '8px', 
    border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', 
    boxSizing: 'border-box' as const, outline: 'none' 
  };
  const labelStyle = { fontWeight: '600', display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.95rem' };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
      <Link to="/" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', display: 'inline-block', marginBottom: '2rem' }}>
        &larr; Voltar ao Catálogo
      </Link>
      
      <div style={{ backgroundColor: '#1e293b', padding: '3rem', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', border: '1px solid #334155' }}>
        <h1 style={{ borderBottom: '1px solid #334155', paddingBottom: '1rem', margin: '0 0 2rem 0', color: '#f8fafc' }}>Adicionar Novo Filme</h1>
        
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Título do Filme *</label>
          <input type="text" name="titulo" required value={formData.titulo} onChange={handleChange} style={inputStyle} placeholder="Ex: O Senhor dos Anéis" />

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={labelStyle}>Data de Lançamento</label>
              <input type="date" name="data_lancamento" value={formData.data_lancamento} onChange={handleChange} style={{...inputStyle, colorScheme: 'dark'}} />
            </div>

            <div style={{ flex: '1 1 200px' }}>
              <label style={labelStyle}>Ano de Lançamento</label>
              <input 
                type="number" name="ano_lancamento" min="1888" 
                value={formData.ano_lancamento} onChange={handleChange} 
                readOnly={!!formData.data_lancamento}
                style={{
                  ...inputStyle, 
                  backgroundColor: formData.data_lancamento ? '#1e293b' : '#0f172a',
                  color: formData.data_lancamento ? '#64748b' : '#f8fafc',
                  cursor: formData.data_lancamento ? 'not-allowed' : 'text'
                }} 
                placeholder="Ex: 2001" 
              />
            </div>

            <div style={{ flex: '1 1 200px' }}>
              <label style={labelStyle}>Duração (minutos)</label>
              <input type="number" name="duracao_minutos" min="0" value={formData.duracao_minutos} onChange={handleChange} style={inputStyle} placeholder="Ex: 178" />
            </div>
          </div>

          <label style={labelStyle}>URL do Poster (Capa vertical)</label>
          <input type="url" name="url_poster" value={formData.url_poster} onChange={handleChange} style={inputStyle} placeholder="https://link-da-imagem.com/poster.jpg" />

          <label style={labelStyle}>URL do Backdrop (Fundo horizontal)</label>
          <input type="url" name="url_backdrop" value={formData.url_backdrop} onChange={handleChange} style={inputStyle} placeholder="https://link-da-imagem.com/fundo.jpg" />

          <label style={labelStyle}>Sinopse</label>
          <textarea name="sinopse" value={formData.sinopse} onChange={handleChange} style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }} placeholder="Escreva um breve resumo do filme..." />

          <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '1rem', transition: 'background-color 0.2s' }}>
            {isSubmitting ? 'A guardar...' : 'Guardar Filme no Catálogo'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewMovie;