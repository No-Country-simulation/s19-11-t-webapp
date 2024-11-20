from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import date

Base = declarative_base()

class UsuarioORM(Base):
    __tablename__ = 'usuarios'
    id_usuario: int = Column(Integer, primary_key=True, index=True)
    nombre: str = Column(String, index=True)
    apellido: str = Column(String, index=True)
    direccion: str = Column(String)
    email: str = Column(String, unique=True, index=True)
    contraseña: str = Column(String)

class PacienteORM(UsuarioORM):
    __tablename__ = 'pacientes'
    id_paciente: int = Column(Integer, primary_key=True, index=True)
    id_usuario: int = Column(Integer, ForeignKey('usuarios.id_usuario', onupdate='CASCADE', ondelete='CASCADE'))
    fecha_nacimiento: date = Column(Date)
    genero: str = Column(String)
    numero_seguridad_social: str = Column(String)
    historia_clinica: str = Column(String)

class MedicoORM(UsuarioORM):
    __tablename__ = 'medicos'
    id_medico: int = Column(Integer, primary_key=True, index=True)
    id_usuario: int = Column(Integer, ForeignKey('usuarios.id_usuario', onupdate='CASCADE', ondelete='CASCADE'))
    especialidad: str = Column(String)
    nro_matricula: str = Column(String)