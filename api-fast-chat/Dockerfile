############################################################
# Dockerfile para configurar aplicación en node.js
############################################################

# Establece la imagen base
FROM node:12.18.1

# Información de Metadata
# LABEL maintainer="p.beltranes@gmail.com"
# LABEL version="1.0"

# Crear directorio de trabajo
RUN mkdir -p /usr/src/

# Se estable el directorio de trabajo
WORKDIR /usr/src/

# Copia la Aplicación
COPY . /usr/src/

# Para mantener esto liviano
RUN npm install

# Expone la aplicación en el puerto 1337
EXPOSE 8001

ENV NODE_ENV=production
# Inicia la aplicación al iniciar al contenedor
CMD [ "node", "./app.js"]
