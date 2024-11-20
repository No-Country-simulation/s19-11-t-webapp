from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models import user_model as models
from app.schemas import user_schemas as schemas
import bcrypt

# Paciente services
async def create_paciente(db: AsyncSession, paciente: schemas.PacienteCreate):
    hashed_password = bcrypt.hashpw(paciente.contraseña.encode('utf-8'), bcrypt.gensalt())
    db_usuario = models.UsuarioORM(
        nombre=paciente.nombre,
        apellido=paciente.apellido,
        direccion=paciente.direccion,
        email=paciente.email,
        contrasena=hashed_password.decode('utf-8')
    )
    db.add(db_usuario)
    await db.commit()
    await db.refresh(db_usuario)

    db_paciente = models.PacienteORM(
        id_usuario=db_usuario.id_usuario,
        fecha_nacimiento=paciente.fecha_nacimiento,
        telefono=paciente.telefono,
        genero=paciente.genero
    )
    db.add(db_paciente)
    await db.commit()
    await db.refresh(db_paciente)
    return db_paciente

async def get_pacientes(db: AsyncSession):
    result = await db.execute(select(models.PacienteORM))
    return result.scalars().all()