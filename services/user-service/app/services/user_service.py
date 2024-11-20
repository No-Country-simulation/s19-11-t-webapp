from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models import user_model as models
from app.schemas import user_schemas as schemas
import bcrypt

# Usuario services
async def create_usuario(db: AsyncSession, usuario: schemas.UsuarioCreate):
    hashed_password = bcrypt.hashpw(usuario.contraseña.encode('utf-8'), bcrypt.gensalt())
    db_usuario = models.UsuarioORM(
        nombre=usuario.nombre,
        apellido=usuario.apellido,
        direccion=usuario.direccion,
        email=usuario.email,
        contraseña=hashed_password.decode('utf-8')
    )
    db.add(db_usuario)
    await db.commit()
    await db.refresh(db_usuario)
    await db.close()
    return db_usuario

async def update_usuario(db: AsyncSession, usuario_id: int, usuario: schemas.UsuarioUpdate):
    result = await db.execute(select(models.UsuarioORM).filter(models.UsuarioORM.id_usuario == usuario_id))
    db_usuario = result.scalars().first()
    if db_usuario is None:
        return None
    for key, value in usuario.model_dump_json(exclude_unset=True).items():
        setattr(db_usuario, key, value)
    await db.commit()
    await db.refresh(db_usuario)
    await db.close()
    return db_usuario

async def get_usuarios(db: AsyncSession):
    result = await db.execute(select(models.UsuarioORM))
    await db.close()
    return result.scalars().all()
