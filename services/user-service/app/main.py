from fastapi import FastAPI
from app.api.routes import user_routes
from app.db.database import Base, sync_engine  # Importar el motor síncrono
import app.db.base  # Importar base.py para registrar los modelos

app = FastAPI()

@app.get('/')
def read_root():
    return {'message': 'Hello World'}

# Importar y crear todas las tablas en la base de datos usando el motor síncrono
Base.metadata.create_all(bind=sync_engine)

app.include_router(user_routes.router, prefix='/api')
