from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import user_schemas
from app.services import paciente_service
from app.db import database

router = APIRouter()

@router.post('/pacientes/', response_model=user_schemas.Paciente)
async def create_paciente(paciente: user_schemas.PacienteCreate, db: AsyncSession = Depends(database.get_db)):
    return await paciente_service.create_paciente(db=db, paciente=paciente)

@router.get('/pacientes/', response_model=list[user_schemas.Paciente])
async def read_pacientes(db: AsyncSession = Depends(database.get_db)):
    return await paciente_service.get_pacientes(db)
