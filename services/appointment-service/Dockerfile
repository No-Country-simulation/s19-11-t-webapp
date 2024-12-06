# Usa la imagen base de Node.js
FROM node:16

# Establece el directorio de trabajo en el contenedor
WORKDIR /app/appointment-service

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código de la aplicación al contenedor
COPY . /app/appointment-service

# Instala nodemon globalmente
RUN npm install -g nodemon

# Instalar default-mysql-client
# RUN apt-get update && apt-get install -y default-mysql-client

# Expone el puerto de la aplicación
EXPOSE 3000

# Usa nodemon para correr el servidor
CMD ["nodemon", "src/app.js"]
