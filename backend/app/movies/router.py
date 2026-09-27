from app.movies.models import UserReview
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.movies.models import DimMovie, DimReview
from app.movies.schemas import MovieListResponse, MovieDetailResponse, ReviewResponse, ReviewCreate
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