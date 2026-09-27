import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import NewMovie from './pages/NewMovie'; // 1. Tem de importar o ficheiro novo aqui!

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* 2. Tem de adicionar esta linha para o React conhecer a página */}
        <Route path="/novo-filme" element={<NewMovie />} /> 
        
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </Router>
  );
}

export default App;