
# Auth User Microservice API

## Introducción

El microservicio de autenticación de usuarios se encarga de gestionar el acceso y la autenticación mediante el uso de tokens. Proporciona endpoints para el inicio de sesión, validación, renovación de tokens y cierre de sesión, asegurando un flujo seguro y eficiente. Esta documentación detalla los endpoints disponibles y las instrucciones para ejecutar el servicio en un entorno Docker.

## Configuración del Entorno

Para el correcto funcionamiento del servicio, es necesario configurar las variables de entorno y las claves de cifrado utilizadas en la autenticación.

#### Variables de Entorno

El servicio requiere las siguientes variables de entorno para funcionar correctamente:

- `SECRET_KEY`: Clave secreta para Django.
- `DEBUG`: Controla el modo de depuración en el servicio. Por defecto, debe estar en `False`.
- `HOST`: Dirección del host de la base de datos.
- `PORT`: Puerto de la base de datos.
- `DATABASE`: Nombre de la base de datos.
- `USER`: Usuario de la base de datos.
- `PASSWORD`: Contraseña del usuario de la base de datos.

#### Llaves de Encriptacion de tokens

Este microservicio utiliza claves específicas para cifrar y descifrar tokens de autenticación. Dichas claves deben almacenarse en la ruta:

- `services\user-service\keys`

Consulta la carpeta compartida de [Google Drive](https://drive.google.com/drive/folders/1cVA_SRqlosdbBTHTU1ZPFduL7Ym_Tsal) para acceder a las variables de entorno y las claves necesarias para el despliegue.

## Ejecución con Docker

Para ejecutar el microservicio de autenticación y gestión de usuarios en un entorno Docker, sigue estos pasos:

1. **Construcción de la imagen**:
  Ejecuta el siguiente comando para crear las imágenes necesarias a partir del archivo     `docker-compose.yml`:

  ```bash
   docker-compose buid
  ```
Esto construirá las imágenes de los contenedores según la configuración del Dockerfile y las dependencias definidas en el archivo requirements.txt.

2. **Levantar el contenedor**:
  Una vez construidas las imágenes, levanta los contenedores con el siguiente comando:
  
  ```bash
   docker-compose up    
  ```

Este comando hará lo siguiente:

- Iniciará el contenedor de la base de datos db y el contenedor del servicio web.
- El servicio web esperará a que la base de datos esté disponible, aplicará las migraciones de Django (mediante python manage.py migrate), y luego iniciará el servidor de Django en el puerto 8000.
- Los contenedores estarán conectados a la red interna mynetwork definida en el archivo docker-compose.yml, lo que les permitirá comunicarse entre sí.

#### Acceso a los servicios

- El servicio web (Django) estará disponible en http://localhost:8000.
- La base de datos MySQL será accesible en localhost:3307 en el puerto 3307 de tu máquina local, aunque el contenedor de la base de datos escucha en el puerto 3306 internamente.

#### Verificar si el contenedor está levantado correctamente

Una vez que hayas ejecutado el comando docker-compose up y los contenedores estén en funcionamiento, deberás ver lo siguiente en la consola:

```bash
  user-service  | Connection to db (172.18.0.2) 3306 port [tcp/mysql] succeeded!
  user-service  | Operations to perform:
  user-service  |   Apply all migrations: admin, auth, contenttypes, especialidad, sessions, token_blacklist, users
  user-service  | Running migrations:
  user-service  |   No migrations to apply.
  user-service  | Watching for file changes with StatReloader
```

#### Consideraciones adicionales
Asegúrate de que el archivo .env se encuentre en la misma carpeta que el archivo docker-compose.yml para que las variables de entorno necesarias sean cargadas correctamente.

Recuerda que el archivo .env contiene información sensible como las credenciales de la base de datos, por lo que no debe ser subido a repositorios públicos. Asegúrate de incluir .env en el archivo .gitignore para evitar esto.

---



## Endpoints

El microservicio está dividido en tres módulos: **Usuario**, **Autenticación** y **Especialidad**. A continuación, se detallan los endpoints disponibles para interactuar con cada uno de los módulos.

### Especialidad

Es el encargado de manejar las especialidades de los médicos. Es **necesario** que exista una especialidad antes de realizar el registro de un **médico**.

#### Get Especialidades

Este endpoint devuelve una lista de todas las especialidades disponibles. No requiere parámetros de entrada.

```http
  GET /api/especialidad/
```

| Parameter | Type      | Description           |
| :-------- | :-------- | :-------------------- |
| `Ninguno` | `Ninguno` | No recibe parámetros. |

#### Get Especialidad

Este endpoint devuelve los detalles de una especialidad específica, identificada por su id. Se debe proporcionar el id de la especialidad en la URL.

```http
  GET /api/especialidades/${id}
```

| Parameter | Type      | Description                          |
| :-------- | :-------- | :----------------------------------- |
| `id`      | `integer` | **Required**. Id de la especialidad. |

#### POST Especialidad

Este endpoint permite crear una nueva especialidad médica. El cuerpo de la solicitud debe incluir el nombre de la especialidad.

```http
  POST /api/especialidades/
```

| Field     | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `nombre`  | `string` | **Required**. Nombre de la especialidad. |

#### Ejemplo

```json
{
  "nombre": "Cardiología"
}
```

#### Respuesta esperada

Se espera el siguiente mensaje, junto al código HTTP 201 Created.

```json
{
  "id_especialidad": 1,
  "nombre": "Cardiología"
}
```

---

### Usuario

Este módulo se encarga de gestionar los usuarios, que pueden ser pacientes o médicos. Los pacientes y médicos comparten el mismo modelo de usuario, pero con campos adicionales específicos para cada tipo.

### Pacientes

Estos endpoints permiten gestionar los datos de los pacientes, que incluyen información personal y médica. Permiten crear y obtener la información de los pacientes en el sistema.

#### Get Pacientes

Este endpoint devuelve una lista de todos los pacientes registrados.

```http
  GET /api/pacientes/
```

| Parameter | Type      | Description           |
| :-------- | :-------- | :-------------------- |
| `Ninguno` | `Ninguno` | No recibe parámetros. |

#### Get Paciente

Este endpoint devuelve los detalles de un paciente específico, identificado por su id. Se debe proporcionar el id del paciente en la URL.

```http
  GET /api/pacientes/${id}
```

| Parameter | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `id`      | `integer`| **Required**. Id del paciente. |

#### POST Paciente

Este endpoint permite crear un nuevo paciente. El cuerpo de la solicitud debe incluir los datos del usuario (email, contraseña, nombre, apellido, teléfono) y la información adicional del paciente (documento, dirección, fecha de nacimiento y género).

```http
  POST /api/pacientes/
```

| Field                | Type     | Description                                        |
| :------------------- | :------- | :------------------------------------------------- |
| `usuario`            | `object` | **Required**. Información del usuario.             |
| `usuario.email`      | `string` | **Required**. Email del usuario.                   |
| `usuario.password`   | `string` | **Required**. Contraseña del usuario.              |
| `usuario.first_name` | `string` | **Required**. Nombre del usuario.                  |
| `usuario.last_name`  | `string` | **Required**. Apellido del usuario.                |
| `usuario.telefono`   | `string` | **Required**. Teléfono del usuario.                |
| `documento`          | `string` | **Required**. Documento del paciente.              |
| `direccion`          | `string` | **Required**. Dirección del paciente.              |
| `fecha_nacimiento`   | `string` | **Required**. Fecha de nacimiento (YYYY-MM-DD).    |
| `genero`             | `string` | **Required**. Required. Género del paciente (M/F). |

#### Ejemplo

```json
{
    "usuario": {
        "email": "johndoe@example.com",
        "password": "12345678",
        "first_name": "John",
        "last_name": "Doe",
        "telefono": "123456789"
    },
    "documento": "12345678",
    "direccion": "Calle Falsa 123",
    "fecha_nacimiento": "1990-01-01",
    "genero": "M",
}
```

#### Respuesta esperada

Se espera el siguiente mensaje, junto al código HTTP 201 Created.

```json
{
  "message": "Paciente creado exitosamente"
}
```
---

### Médicos

Estos endpoints permiten gestionar la información de los médicos, que son usuarios asociados a una especialidad y un número de matrícula. Solo se pueden crear y obtener médicos del sistema.

#### Get Médico

Este endpoint devuelve una lista de todos los médicos registrados.

```http
  GET /api/medicos/
```

| Parameter | Type      | Description           |
| :-------- | :-------- | :-------------------- |
| `Ninguno` | `Ninguno` | No recibe parámetros. |

### Get Médico

Este endpoint devuelve los detalles de un médico específico, identificado por su id. Se debe proporcionar el id del médico en la URL.

```http
  GET /api/medicos/${id}
```

| Parameter | Type      | Description                  |
| :-------- | :-------- | :--------------------------- |
| `id`      | `integer` | **Required**. Id del médico. |

#### POST Médico

Este endpoint permite crear un nuevo médico. El cuerpo de la solicitud debe incluir los datos del usuario (email, contraseña, nombre, apellido, teléfono), así como la especialidad del médico y su número de matrícula.

```http
  POST /api/medicos/
```

| Field                | Type     | Description                                          |
| :------------------- | :------- | :--------------------------------------------------- |
| `usuario`            | `object` | **Required**. Información del usuario.               |
| `usuario.email`      | `string` | **Required**. Email del usuario.                     |
| `usuario.password`   | `string` | **Required**. Contraseña del usuario.                |
| `usuario.first_name` | `string` | **Required**. Nombre del usuario.                    |
| `usuario.last_name`  | `string` | **Required**. Apellido del usuario.                  |
| `usuario.telefono`   | `string` | **Required**. Teléfono del usuario.                  |
| `especialidad`       | `integer`| **Required**. ID de la especialidad médica asociada. |
| `nro_matricula`      | `string` | **Required**. Número de matrícula del médico.        |

#### Ejemplo

```json
{
    "usuario": {
        "email": "testmedico@example.com",
        "password": "12345678",
        "first_name": "John",
        "last_name": "Doe",
        "telefono": "123456789"
    },
    "especialidad": 1,
    "nro_matricula": "MAT12345"
}
```
### Respuesta esperada

Se espera el siguiente mensaje, junto al código HTTP 201 Created.

```json
{
  "message": "Médico creado exitosamente"
}
```

---

### Autenticación

Este módulo maneja la autenticación de usuarios utilizando tokens JWT. Permite la gestión de la sesión del usuario, el refresco de tokens y la verificación de la validez de los tokens.

#### POST Login

Devuelve un par de tokens de acceso y actualización para el usuario en dos cookies. Se requiere el nombre de usuario y la contraseña para iniciar sesión.

```http
  POST /api/auth/login/
```

| Field        | Type     | Description                           |
| :----------- | :------- | :------------------------------------ |
| `email`      | `string` | **Required**. Email del usuario.      |
| `password`   | `string` | **Required**. Contraseña del usuario. |

#### Ejemplo

```json
{
  "email": "johndoe@example.com",
  "password": "12345678"
}
```

#### Respuesta esperada

Se espera el siguiente mensaje, junto al código HTTP 200 OK.

```json
{
  "user": {
    "name": "John",
    "last_name": "Doe",
    "user_type": "Paciente"
  }
}
```

| Cookie          | Type       | Secure | Description                |
| :-------------- | :--------- | :----- | :------------------------- |
| `refresh_token` | `HTTPOnly` | `True` | Token para renovar acceso. |
| `access_token`  | `HTTPOnly` | `True` | Token de acceso temporal.  |

#### POST Refresh Token

Actualiza el token de acceso utilizando el `refresh_token`. Valida el token de actualización almacenado en las cookies y devuelve nuevos tokens de acceso y actualización.

```http
  POST /api/auth/token/refresh/
```

#### Respuesta esperada

Se espera el siguiente mensaje, junto al código HTTP 200 OK.

```json
{
  "message": "Access Token and Refresh Token successfully refreshed"
}
```

| Cookie          | Type       | Secure | Description                            |
| :-------------- | :--------- | :----- | :------------------------------------- |
| `refresh_token` | `HTTPOnly` | `True` | Token para renovar acceso actualizado. |
| `access_token`  | `HTTPOnly` | `True` | Token de acceso temporal.              |

#### POST Verify Token

Verifica la validez de un token proporcionado. Si el token es válido, se devuelve el ID del usuario asociado; si no lo es o ha expirado, se devuelve un error.

```http
  POST /api/auth/token/refresh/
```

| Field        | Type     | Description                           |
| :----------- | :------- | :------------------------------------ |
| `token`      | `string` | **Required**. Access Token a validar. |

#### Ejemplo

```json
{
  {
    "token": "some-token"
  }
}
```
**NOTA:** En lugar de `some-token`, proporcionar el `access_token` que se encuentra en las cookies.

#### Respuesta esperada

Se espera el siguiente mensaje, junto al código HTTP 200 OK.

```json
{
  "message": "Token is valid",
  "user_id": 1
}
```

| Cookie          | Type       | Secure | Description                           |
| :-------------- | :--------- | :----- | :------------------------------------ |
| `refresh_token` | `HTTPOnly` | `True` | Token para renovar acceso.            |
| `access_token`  | `HTTPOnly` | `True` | Token de acceso temporal actualizado. |

#### POST Logout

Cierra sesión del usuario invalidando el token de actualización. Marca el token como inválido en el servidor y elimina los tokens de las cookies.

```http
  POST /api/auth/logout/
```

#### Respuesta Esperada

Se espera el siguiente mensaje, junto al código HTTP 200 OK.

```json
{
  "message": "Logout successful"
}
```
**NOTA:** En lugar de `some-token`, proporcionar el `access_token` que se encuentra en las cookies.