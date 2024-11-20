from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

# URL de la base de datos
SQLALCHEMY_DATABASE_URL = 'mysql+aiomysql://root:leanmsanroot@localhost/healthtech_usuario'

# Crear el motor de la base de datos asíncrono
async_engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)

# Crear el motor de la base de datos síncrono para la creación de tablas
sync_engine = create_engine(SQLALCHEMY_DATABASE_URL.replace('mysql+aiomysql', 'mysql+pymysql'), echo=True)

# Crear la sesión de la base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=async_engine, class_=AsyncSession)

# Crear la base declarativa
Base = declarative_base()

# Dependencia para obtener la sesión de la base de datos
async def get_db():
    async with SessionLocal() as session:
        yield session