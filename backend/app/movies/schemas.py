from pydantic import BaseModel, ConfigDict
from datetime import date

class MovieListResponse(BaseModel):
    sk_movie_id: str
    titulo: str
    ano_lancamento: int | None = None
    url_poster: str | None = None

    model_config = ConfigDict(from_attributes=True)

class MovieDetailResponse(BaseModel):
    sk_movie_id: str
    titulo: str
    sinopse: str | None = None
    duracao_minutos: int | None = None
    status_filme: str | None = None
    data_lancamento: date | None = None
    ano_lancamento: int | None = None
    url_poster: str | None = None
    url_backdrop: str | None = None

    model_config = ConfigDict(from_attributes=True)