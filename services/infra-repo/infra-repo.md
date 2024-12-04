# Infra Repo

## Iniciar las Aplicaciones

1. Levantar los Contenedores <br>
Ejecutar el siguiente comando para construir e iniciar todos los contenedores. Esto levantará los servicios configurados en docker-compose.yml.

```bash
docker-compose up --build
```

2. Configuración de la Base de Datos <br>
Conectar la base de datos usando las credenciales de services/appointment-service/.env. Utilizar puerto 3307. <br>
Ejecutar el script services/appointment-service/db.sql para configurar la base de datos.

3. Acceder a los Recursos <br>
Los servicios estarán disponibles a través de los puertos configurados en los contenedores. Acceder a ellos desde el browser o cualquier herramienta de desarrollo (Postman, cURL, etc.).
