import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError

from app.config import settings
from app.exceptions import ConflictError, NotFoundError
from app.routers import categories, meal_plans, products, recipes, shopping_lists

logger = logging.getLogger("app")

app = FastAPI(title="Lista de Compras API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(NotFoundError)
def handle_not_found(request: Request, exc: NotFoundError):
    return JSONResponse(status_code=404, content={"detail": exc.message})


@app.exception_handler(ConflictError)
def handle_conflict(request: Request, exc: ConflictError):
    return JSONResponse(status_code=409, content={"detail": exc.message})


@app.exception_handler(OperationalError)
def handle_operational_error(request: Request, exc: OperationalError):
    logger.error("Erro de conexão com o banco de dados: %s", exc)
    return JSONResponse(
        status_code=503,
        content={"detail": "Não foi possível conectar ao banco de dados. Tente novamente em instantes."},
    )


@app.exception_handler(Exception)
def handle_unexpected_error(request: Request, exc: Exception):
    logger.exception("Erro inesperado ao processar %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Erro interno do servidor."})


app.include_router(categories.router)
app.include_router(products.router)
app.include_router(recipes.router)
app.include_router(meal_plans.router)
app.include_router(shopping_lists.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
