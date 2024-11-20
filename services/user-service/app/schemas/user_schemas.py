from pydantic import BaseModel, EmailStr
from datetime import date

class UsuarioBase(BaseModel):
    nombre: str
    apellido: str
    direccion: str
    email: EmailStr

class UsuarioCreate(UsuarioBase):
    contraseña: str

class UsuarioUpdate(UsuarioBase):
    contraseña: str = None

class Usuario(UsuarioBase):
    id_usuario: int

    class Config:
        from_attributes = True

class PacienteCreate(UsuarioCreate):
    fecha_nacimiento: date
    telefono: str
    genero: str

class Paciente(Usuario):
    id_paciente: int
    fecha_nacimiento: date
    telefono: str
    genero: str

    class Config:
        from_attributes = True

class PacienteUpdate(UsuarioUpdate):
    fecha_nacimiento: date = None
    telefono: str = None
    genero: str = None

class MedicoCreate(UsuarioCreate):
    especialidad: str
    nro_matricula: str

class MedicoUpdate(UsuarioUpdate):
    especialidad: str = None
    nro_matricula: str = None

class Medico(Usuario):
    id_medico: int
    especialidad: str
    nro_matricula: str

    class Config:
        from_attributes = True