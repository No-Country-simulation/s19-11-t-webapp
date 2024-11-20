from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import user_schemas
from app.services import user_service
from app.db import database

router = APIRouter()

@router.get('/usuarios/', response_model=list[user_schemas.Usuario])
async def read_usuarios(db: AsyncSession = Depends(database.get_db)):
    return await user_service.get_usuarios(db)

@router.post('/usuarios/', response_model=user_schemas.Usuario)
async def create_usuario(usuario: user_schemas.UsuarioCreate, db: AsyncSession = Depends(database.get_db)):
    return await user_service.create_usuario(db=db, usuario=usuario)

@router.put('/usuarios/{usuario_id}', response_model=user_schemas.Usuario)
async def update_usuario(usuario_id: int, usuario: user_schemas.UsuarioUpdate, db: AsyncSession = Depends(database.get_db)):
    db_usuario = await user_service.update_usuario(db, usuario_id=usuario_id, usuario=usuario)
    if db_usuario is None:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')
    return db_usuario

@router.delete('/usuarios/{usuario_id}', response_model=user_schemas.Usuario)
async def delete_usuario(usuario_id: int, db: AsyncSession = Depends(database.get_db)):
    db_usuario = await user_service.delete_usuario(db, usuario_id=usuario_id)
    if db_usuario is None:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')
    return db_usuario