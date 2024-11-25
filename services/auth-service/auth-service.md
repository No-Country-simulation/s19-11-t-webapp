# Microservicio de Seguridad: Autenticación, Autorización, Protección de Rutas.

- Autenticación de usuarios (validar credenciales).
- Generación y gestión de tokens (ej. JWT).
- Autorización (gestionar roles y permisos de usuarios).
- Gestión de sesiones (opcionalmente, manejar refresh tokens y revocación de sesiones).
- Protección de datos sensibles (como contraseñas cifradas).

## Componentes
```
    1. Autenticación

    Validación de Credenciales: Cuando un usuario intenta iniciar sesión, el microservicio de seguridad valida las credenciales. Esto implica verificar la autenticidad de la contraseña del usuario (compararla con el hash almacenado en la base de datos) y la existencia del usuario.
    - Tecnologías:
        - bcrypt o Argon2 para el hash de contraseñas.
        - LDAP (opcional) si deseas integrar un sistema de autenticación de directorio centralizado.
```
```
    2. Tokens

    Autenticación basada en JWT: Cuando un usuario se autentica correctamente, el microservicio emite un JWT (JSON Web Token) que contiene los detalles del usuario y sus roles. El JWT generalmente incluye:
    - Datos del usuario: como el ID de usuario, nombre, etc.
    - Roles y permisos del usuario.
    - Fecha de expiración: para evitar el uso ilimitado del token.
    - Tecnologías:
        - PyJWT (en Python)
    - Roles y Claims: El JWT puede tener claims como:
        - `sub` (subject): ID del usuario.
        - `roles`: lista de roles del usuario.
        - `exp` (expiration): timestamp de expiración.
    Refresco de Tokens: Si quieres tener un sistema con refresh tokens, el servicio debe generar un refresh token en el momento de la autenticación. Este token puede usarse para obtener un nuevo JWT cuando el original haya expirado.
```
```
    3. Autorización

    - Control de acceso basado en roles (RBAC): El microservicio de seguridad debe ser capaz de asignar roles (por ejemplo, `admin`, `usuario`, `moderador`, etc.) y permisos asociados a esos roles. Esto garantiza que las personas o aplicaciones solo tengan acceso a las funcionalidades para las que tienen permiso.
    - Verificación de permisos: Para cada solicitud que realice un usuario a otro microservicio (como el de CRUD de usuarios), el JWT debe ser verificado y, si es válido, el microservicio debe verificar los roles y permisos asociados al usuario.
    - Tecnologías:
        - OAuth 2.0 y OpenID Connect (si deseas integrar un sistema de autorización más complejo).
        - Authorization Server si estás integrando con sistemas externos.
```
```
    4. Sesiones

    - Si implementas refresh tokens, es importante gestionarlos adecuadamente. Los refresh tokens pueden almacenarse en una base de datos segura (o en un sistema de almacenamiento como Redis) y estar asociados a un ID de sesión.
    - Revocación de tokens: El servicio de seguridad debe permitir la revocación de tokens, tanto de acceso como de refresco, si se detecta un comportamiento sospechoso (p. ej., el usuario cambia la contraseña o cierra sesión).
```
```
    5. Protección de Datos

    - Cifrado de contraseñas: Las contraseñas nunca deben almacenarse en texto plano. Deben ser cifradas con un algoritmo seguro como bcrypt, PBKDF2 o Argon2.
    - Seguridad en las comunicaciones: Asegúrate de que todas las comunicaciones entre el cliente y el microservicio estén cifradas mediante HTTPS.
    - Auditoría y registro: El microservicio debe registrar eventos críticos de seguridad (como intentos de inicio de sesión fallidos, cambios en la contraseña, solicitudes con tokens inválidos, etc.) para monitorear actividad sospechosa.
```

## Requisitos
```
Python 3.x
Flask
Docker
Archivo .env con las variables de configuración
```

## Tecnologías
```
Flask: Framework web para Python.
JWT (JSON Web Token): Para autenticación sin estado.
bcrypt: Para hash de contraseñas.
Redis: Para almacenar sesiones y tokens de refresco.
```

## Estructura Archivos
```
s19-11-t-webapp/
│
├── auth-service/
│   ├── app/
│   │   ├── connections/
│   │   │   ├── __init__.py      # Marca el paquete connections
│   │   │   └── config.py        # Configuración general (Redis, JWT, servicios externos)
│   │   │
│   │   ├── resources/
│   │   │   ├── logs/
│   │   │   │   └── __init__.py  # Configuración para manejo de logs
│   │   │   └── __init__.py      # Marca el paquete resources
│   │   │
│   │   ├── routes/
│   │   │   ├── __init__.py      # Marca el paquete routes
│   │   │   └── auth.py          # Blueprint para manejar rutas de autenticación
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py             # Marca el paquete services
│   │   │   ├── authentication_service.py  # Lógica de autenticación
│   │   │   └── authorization_service.py   # Lógica de autorización
│   │   │
│   │   ├── views/
│   │   │   ├── __init__.py      # Marca el paquete views
│   │   │   └── models.py        # Definición de modelos (opcional)
│   │   │
│   │   ├── __init__.py          # Contiene la función create_app
│   │   └── config.py            # Configuración de la aplicación
│   │
│   ├── auth-service.md          # Especificaciones técnicas del servicio de autenticación
│   ├── run.py                   # Script principal para ejecutar la aplicación
│   ├── requirements.txt         # Dependencias del proyecto
│   ├── Dockerfile               # Configuración para construir la imagen Docker
│   └── docker-compose.yml       # Configuración Docker Compose para servicios
│
├── env/                         # Directorio del entorno virtual de Python (opcional)
├── .env                         # Variables de entorno (e.g. JWT_SECRET_KEY, configuración Redis)
├── .gitignore                   # Exclusión de archivos y carpetas en Git
└── README.md                    # Descripción general del proyecto
```

## Instrucciones
Clonar el repositorio:
```bash
git clone https://github.com/No-Country-simulation/s19-11-t-webapp.git
cd s19-11-t-webapp
```
Actualiza la rama remota de seguridad:
```bash
git switch -c auth-service origin/auth-service
git checkout auth-service
```
Crear un entorno virtual:
```bash
python -m venv env
./env/Scripts/activate
```
Instalar dependencias:
```bash
pip install -r requirements.txt
```
Configurar variables de entorno:
Crea un archivo .env en el directorio raíz de tu proyecto. Este archivo debe contener las siguientes variables de entorno:

```ini
# JWT
JWT_SECRET_KEY=supersecretkey
USER_SERVICE_URL=http://localhost:8000

# Configuration
REDIS_HOST=redis # Usamos el nombre del servicio de Redis en Docker. Sino podría ser localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=
```
Si usas PostgreSQL, asegúrate de tener una base de datos configurada y de ejecutar las migraciones necesarias para las tablas de usuarios, roles, etc.
(Opcional) Configurar Redis:
Si deseas usar Redis para manejar tokens de refresco y sesiones, asegúrate de tener un servidor Redis en ejecución y configura la variable de entorno correspondiente en el archivo .env.


## Ejecución en Contenedores Docker

Construir las imágenes (microservicio y Redis):
``` bash
docker-compose build
```
Levantar los contenedores:
```bash
docker-compose up
```
- Redis: En el puerto 6379.
- Security Service: En el puerto 5000.
- Accede al servicio en http://localhost:5000. <br>

Consola de Redis y logs del servicio::
```bash
docker exec -it redis redis-cli
docker logs -f security-service
```

Probar la API desde el contenedor
```bash
docker exec -it security-service curl -H "Authorization: Bearer <your_jwt_token>" http://127.0.0.1:5000/api/auth/verify-token
```

Parar y eliminar contenedores:
```bash
docker-compose down  # Asociados a la imagen
docker rmi *IMAGE ID*  # Identificados
```

## Ejecución Local
```bash
python run.py
```
