# Usa la imagen base de Node.js
FROM node:16

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código de la aplicación al contenedor
COPY . .

# Instala nodemon globalmente
RUN npm install -g nodemon

# Expone el puerto de la aplicación
EXPOSE 3000

# Usa nodemon para correr el servidor
CMD ["nodemon", "src/app.js"]
