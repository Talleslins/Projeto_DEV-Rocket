# Visagio Rocket Lab 2026 - Catálogo de Filmes

Este projeto é uma aplicação full-stack para avaliação e listagem de filmes, desenvolvido como parte do desafio Visagio Rocket Lab 2026.

## Tecnologias Utilizadas

**Backend:**
- Python 3
- FastAPI
- SQLAlchemy (Async) & Alembic
- SQLite

**Frontend:**
- React 18
- TypeScript
- Vite
- React Router Dom

## Estrutura do Projeto

O projeto utiliza uma arquitetura monorepo, dividida em dois domínios principais:
- `/backend`: API RESTful e gestão da base de dados.
- `/frontend`: Interface de utilizador (SPA).

## Como Executar Localmente

### Pré-requisitos
- Node.js
- Python 3.10+

### 1. Iniciar o Backend
```bash
cd backend
# Ativar o ambiente virtual (.venv)
.venv\Scripts\activate
# Iniciar o servidor
uvicorn app.main:app --reload