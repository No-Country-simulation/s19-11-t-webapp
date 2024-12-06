# Usa una imagen oficial de Python como base
FROM python:3.12

# Establece el directorio de trabajo
WORKDIR /app/notification-service/

# Copia los archivos de dependencias (requirements.txt) al contenedor
COPY requirements.txt /app/notification-service/

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código fuente del microservicio
COPY . .

# Expone el puerto que usará el microservicio de correo
EXPOSE 3002

# Define el comando para ejecutar el microservicio de correo
CMD ["python", "app.py"]
