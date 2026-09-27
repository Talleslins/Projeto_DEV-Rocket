import asyncio
from app.db.session import engine
from app.movies.models import Base

async def init_db():
    print("A sincronizar a base de dados...")
    async with engine.begin() as conn:
        # Isto vai criar apenas as tabelas que faltam (user_reviews)
        await conn.run_sync(Base.metadata.create_all)
    print("Tabela 'user_reviews' criada com sucesso!")

if __name__ == "__main__":
    asyncio.run(init_db())