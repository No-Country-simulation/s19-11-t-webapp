from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models import user_model as models
from app.schemas import user_schemas as schemas
import bcrypt

# Medico services
async def create_medico(db: AsyncSession, medico: schemas.MedicoCreate):
    hashed_password = bcrypt.hashpw(medico.contraseña.encode('utf-8'), bcrypt.gensalt())
    db_usuario = models.UsuarioORM(
        nombre=medico.nombre,
        apellido=medico.apellido,
        direccion=medico.direccion,
        email=medico.email,
        contrasena=hashed_password.decode('utf-8')
    )
    db.add(db_usuario)
    await db.commit()
    await db.refresh(db_usuario)

    db_medico = models.MedicoORM(
        id_usuario=db_usuario.id_usuario,
        especialidad=medico.especialidad,
        nro_matricula=medico.nro_matricula
    )
    db.add(db_medico)
    await db.commit()
    await db.refresh(db_medico)
    return db_medico

async def get_medicos(db: AsyncSession):
    result = await db.execute(select(models.MedicoORM))
    return result.scalars().all()