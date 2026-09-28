# 🚀 Visagio Rocket Lab - Catálogo de Filmes

Uma aplicação Full-Stack desenvolvida como resolução do desafio Visagio Rocket Lab. Este projeto consiste num sistema robusto de gestão de um catálogo de filmes, permitindo a visualização, pesquisa, avaliação e administração (CRUD) de obras cinematográficas.

## ✨ Funcionalidades Principais

* **Catálogo Dinâmico:** Listagem de filmes com paginação e barra de pesquisa em tempo real.
* **Sistema Híbrido de Avaliações:** Integração dos dados históricos da base de dados com um novo sistema de submissão de resenhas de texto por parte dos utilizadores. A nota média do filme é recalculada automaticamente (média ponderada) sempre que uma nova avaliação (0 a 10) é submetida.
* **Gestão de Filmes (CRUD):** 
  * Criação de novos filmes com validação dinâmica de formulários (extração automática do ano a partir da data de lançamento e bloqueios de campos para garantir a integridade dos dados).
  * Remoção segura em cascata (Cascade Delete) via execução SQL direta, garantindo que relações complexas (`bridge_movie_person`, `fact_movies_performance`, etc.) são limpas sem violar as *Foreign Key constraints* do SQLite.
* **Arquitetura Assíncrona:** Backend de alta performance construído com rotas e operações de base de dados 100% assíncronas.

## 🛠️ Tecnologias Utilizadas

### Backend
* **Python 3**
* **FastAPI:** Framework web moderno e ultrarrápido para a construção da API.
* **SQLAlchemy & SQLite:** ORM para modelação e consultas otimizadas, e motor de base de dados relacional.
* **Uvicorn:** Servidor ASGI para execução assíncrona.

### Frontend
* **React 18:** Biblioteca de construção de interfaces de utilizador.
* **TypeScript:** Tipagem estática para maior segurança e previsibilidade do código.
* **Vite:** *Build tool* ultrarrápido para desenvolvimento frontend.
* **React Router Dom:** Gestão de rotas e navegação entre páginas (SPA).

## 🚀 Como Executar o Projeto

Para correr este projeto localmente, certifique-se de que tem o **Node.js** e o **Python 3** instalados na sua máquina.

### 1. Configurar o Backend
Abra um terminal na raiz do projeto e navegue para a pasta do backend:
```bash
cd backend
```

Crie e ative um ambiente virtual (Windows):
```bash
python -m venv .venv
.\.venv\Scripts\activate
```

Instale as dependências a partir do `pyproject.toml` e inicie o servidor:
```bash
pip install .
uvicorn app.main:app --reload
```
*(Nota: Se estiver a utilizar o Poetry como gestor de pacotes, substitua `pip install .` por `poetry install`)*

*O servidor ficará disponível em `http://localhost:8000`.*

### 2. Configurar o Frontend
Abra um **novo terminal** na raiz do projeto e navegue para a pasta do frontend:
```bash
cd frontend
```

Instale as dependências via NPM e inicie o servidor de desenvolvimento:
```bash
npm install
npm run dev
```
*A aplicação ficará disponível no seu navegador em `http://localhost:5173`.*

## 📂 Estrutura do Projeto

```text
rocketlab2026-2/
├── backend/
│   ├── app/
│   │   ├── main.py          # Ponto de entrada do FastAPI
│   │   ├── db/              # Configurações do SQLAlchemy e SQLite
│   │   └── movies/          # Domínio de filmes (Models, Schemas e Rotas)
│   ├── data/                # Base de dados SQLite legada
│   └── pyproject.toml       # Dependências e configurações do projeto Python
└── frontend/
    ├── src/
    │   ├── App.tsx          # Configuração do React Router
    │   ├── pages/           # Ecrãs (Home, MovieDetails, NewMovie)
    │   ├── services/        # Funções de fetch/chamadas à API
    │   └── types/           # Interfaces e tipagens TypeScript
    └── index.html           # Ponto de entrada da aplicação
```

## 👨‍💻 Autor
**Talles Pinheiro Lins**
Desenvolvido no âmbito do desafio Visagio Rocket Lab.