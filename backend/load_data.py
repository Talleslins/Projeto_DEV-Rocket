import csv
import os
from sqlalchemy import create_engine, text
from app.core.config import get_settings

# 1. Herda a configuração oficial do banco de dados (garante o caminho correto)
db_url = get_settings().database_url.replace("+aiosqlite", "")
engine = create_engine(db_url)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

tabelas_carga = [
    (os.path.join(BASE_DIR, 'data', 'bases_atv_dev1', 'dim_movies.csv'), 'dim_movies'),
    (os.path.join(BASE_DIR, 'data', 'bases_atv_dev1', 'dim_genres.csv'), 'dim_genres'),
    (os.path.join(BASE_DIR, 'data', 'bases_atv_dev1', 'dim_companies.csv'), 'dim_companies'),
    (os.path.join(BASE_DIR, 'data', 'bases_atv_dev1', 'dim_people.csv'), 'dim_people'),
    (os.path.join(BASE_DIR, 'data', 'bases_atv_dev1', 'dim_reviews.csv'), 'dim_reviews'),
    
    (os.path.join(BASE_DIR, 'data', 'bases_atv_dev_2', 'bridge_movie_genre.csv'), 'bridge_movie_genre'),
    (os.path.join(BASE_DIR, 'data', 'bases_atv_dev_2', 'bridge_movie_company.csv'), 'bridge_movie_company'),
    (os.path.join(BASE_DIR, 'data', 'bases_atv_dev_2', 'bridge_movie_person.csv'), 'bridge_movie_person'),
    (os.path.join(BASE_DIR, 'data', 'bases_atv_dev_2', 'fact_movies_performance.csv'), 'fact_movies_performance'),
    
    (os.path.join(BASE_DIR, 'data', 'bases_atv_dev_2', 'movies_reviews.csv'), 'movie_reviews')
]

# 2. engine.begin() gerencia a transação automaticamente (commit em caso de sucesso)
with engine.begin() as conn:
    for caminho, tabela in tabelas_carga:
        if not os.path.exists(caminho):
            print(f"Aviso: Arquivo {caminho} não encontrado. Saltando...")
            continue
            
        with open(caminho, mode='r', encoding='utf-8-sig') as f:
            linhas = list(csv.DictReader(f))
            if not linhas:
                continue
            
            # 3. Formata parâmetros nomeados no padrão SQLAlchemy (:coluna1, :coluna2)
            colunas = ', '.join(linhas[0].keys())
            marcadores = ', '.join([':' + k for k in linhas[0].keys()])
            sql = text(f"INSERT INTO {tabela} ({colunas}) VALUES ({marcadores})")
            
            try:
                conn.execute(sql, linhas)
                print(f"Sucesso: inserções concluídas em '{tabela}'.")
            except Exception as e:
                print(f"Erro ao inserir na tabela '{tabela}': {e}")

print("Carga de dados concluída.")