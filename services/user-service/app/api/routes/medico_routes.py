from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import user_schemas
from app.services import medico_service
from app.db import database

router = APIRouter()

@router.post('/medicos/', response_model=user_schemas.Medico)
async def create_medico(medico: user_schemas.MedicoCreate, db: AsyncSession = Depends(database.get_db)):
    return await medico_service.create_medico(db=db, medico=medico)

@router.get('/medicos/', response_model=list[user_schemas.Medico])
async def read_medicos(db: AsyncSession = Depends(database.get_db)):
    return await medico_service.get_medicos(db)