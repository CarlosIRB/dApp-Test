# Dockerfile

# Usar una imagen base de Node.js
FROM node:14

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el código fuente del frontend
COPY . .

# Exponer el puerto (ajustar si es necesario)
EXPOSE 8080

# Comando para ejecutar el servidor estático
CMD ["npx", "http-server", "."]