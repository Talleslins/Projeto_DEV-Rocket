import uuid
from app.movies.models import UserReview
from fastapi import APIRouter, Depends, HTTPException , status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy import delete, text
from app.db.session import get_db
from app.movies.models import DimMovie, DimReview
from app.movies.schemas import MovieListResponse, MovieDetailResponse, ReviewResponse, ReviewCreate, MovieCreate , MovieUpdate
router = APIRouter()

@router.get("/", response_model=list[MovieListResponse])
async def list_movies(
    skip: int = 0,
    limit: int = 20,
    title: str | None = None, 
    db: AsyncSession = Depends(get_db)
):
    query = select(DimMovie)
    
    # Se o utilizador enviou um título, é aplicado o filtro (ilike ignora maiúsculas/minúsculas)
    if title:
        query = query.where(DimMovie.titulo.ilike(f"%{title}%"))
        
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{sk_movie_id}", response_model=MovieDetailResponse)
async def get_movie(
    sk_movie_id: str,
    db: AsyncSession = Depends(get_db)
):
    # 1. Buscar o filme
    query = select(DimMovie).where(DimMovie.sk_movie_id == sk_movie_id)
    result = await db.execute(query)
    movie = result.scalars().first()

    if not movie:
        raise HTTPException(status_code=404, detail="Filme não encontrado")

    # 2. Buscar as estatísticas antigas na tabela dim_reviews
    stats_query = select(DimReview).where(DimReview.sk_movie_id == sk_movie_id)
    stats_result = await db.execute(stats_query)
    stats = stats_result.scalars().first()

    # 3. Montar a resposta combinada
    movie_data = movie.__dict__.copy()
    movie_data["nota_media_base"] = stats.nota_media_usuarios if stats else 0.0
    movie_data["qtd_avaliacoes_base"] = stats.qtd_avaliacoes_usuarios if stats else 0

    return movie_data

@router.get("/{sk_movie_id}/reviews", response_model=list[ReviewResponse])
async def list_movie_reviews(
    sk_movie_id: str,
    db: AsyncSession = Depends(get_db)
):
    query = select(UserReview).where(UserReview.sk_movie_id == sk_movie_id)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/{sk_movie_id}/reviews", response_model=ReviewResponse)
async def create_movie_review(
    sk_movie_id: str,
    review: ReviewCreate,
    db: AsyncSession = Depends(get_db)
):
    # Verifica se o filme existe
    movie_query = select(DimMovie).where(DimMovie.sk_movie_id == sk_movie_id)
    result = await db.execute(movie_query)
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Filme não encontrado")

    # Cria a nova avaliação na tabela correta
    new_review = UserReview(
        sk_movie_id=sk_movie_id,
        rating=review.rating,
        review_text=review.review_text
    )
    db.add(new_review)
    await db.commit()
    await db.refresh(new_review)
    
    return new_review
# --- ROTAS DE GESTÃO DE FILMES (CRUD) ---

@router.post("/", response_model=MovieDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_movie(movie: MovieCreate, db: AsyncSession = Depends(get_db)):
    # Gera um ID único para o novo filme
    novo_id = str(uuid.uuid4())
    
    novo_filme = DimMovie(
        sk_movie_id=novo_id,
        id_filme=int(uuid.uuid4().int % 1000000), # ID numérico fictício
        **movie.model_dump()
    )
    db.add(novo_filme)
    await db.commit()
    await db.refresh(novo_filme)
    
    # Formata a resposta com as estatísticas zeradas
    movie_data = novo_filme.__dict__.copy()
    movie_data["nota_media_base"] = 0.0
    movie_data["qtd_avaliacoes_base"] = 0
    return movie_data

@router.put("/{sk_movie_id}", response_model=MovieDetailResponse)
async def update_movie(sk_movie_id: str, movie_update: MovieUpdate, db: AsyncSession = Depends(get_db)):
    query = select(DimMovie).where(DimMovie.sk_movie_id == sk_movie_id)
    result = await db.execute(query)
    movie = result.scalars().first()

    if not movie:
        raise HTTPException(status_code=404, detail="Filme não encontrado")

    # Atualiza apenas os campos enviados
    update_data = movie_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(movie, key, value)

    await db.commit()
    await db.refresh(movie)
    
    # Mantém as estatísticas antigas na resposta
    stats_query = select(DimReview).where(DimReview.sk_movie_id == sk_movie_id)
    stats_result = await db.execute(stats_query)
    stats = stats_result.scalars().first()
    
    movie_data = movie.__dict__.copy()
    movie_data["nota_media_base"] = stats.nota_media_usuarios if stats else 0.0
    movie_data["qtd_avaliacoes_base"] = stats.qtd_avaliacoes_usuarios if stats else 0
    
    return movie_data

@router.delete("/{sk_movie_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_movie(sk_movie_id: str, db: AsyncSession = Depends(get_db)):
    query = select(DimMovie).where(DimMovie.sk_movie_id == sk_movie_id)
    result = await db.execute(query)
    movie = result.scalars().first()

    if not movie:
        raise HTTPException(status_code=404, detail="Filme não encontrado")

    # Lista de todas as tabelas que podem ter dependências (chaves estrangeiras) do filme
    tabelas_dependentes = [
        "user_reviews", 
        "dim_reviews", 
        "fact_movies_performance",
        "bridge_movie_genre",
        "bridge_movie_company",
        "bridge_movie_person",
        "movie_reviews"
    ]
    
    # Executa a limpeza em cascata em todas elas usando SQL direto
    for tabela in tabelas_dependentes:
        try:
            await db.execute(
                text(f"DELETE FROM {tabela} WHERE sk_movie_id = :id"), 
                {"id": sk_movie_id}
            )
        except Exception:
            # Se a tabela não existir, avança silenciosamente
            pass

    # Com o caminho finalmente livre de amarras, apaga o filme original!
    await db.delete(movie)
    await db.commit()
    
    return None