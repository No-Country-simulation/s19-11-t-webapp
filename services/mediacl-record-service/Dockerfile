# Usa la imagen oficial de Node.js
FROM node:16

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código de la aplicación al contenedor
COPY . .

# Expone el puerto que usará la aplicación
EXPOSE 3001

# Inicia la aplicación en modo de desarrollo
CMD ["npm", "run", "start:dev"]
