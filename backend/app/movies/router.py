from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.movies.models import DimMovie
from app.movies.schemas import MovieListResponse, MovieDetailResponse

router = APIRouter()

@router.get("/", response_model=list[MovieListResponse])
async def list_movies(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    query = select(DimMovie).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{sk_movie_id}", response_model=MovieDetailResponse)
async def get_movie(
    sk_movie_id: str,
    db: AsyncSession = Depends(get_db)
):
    query = select(DimMovie).where(DimMovie.sk_movie_id == sk_movie_id)
    result = await db.execute(query)
    movie = result.scalars().first()

    if not movie:
        raise HTTPException(status_code=404, detail="Filme não encontrado")

    return movie
