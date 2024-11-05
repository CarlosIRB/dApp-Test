# Usa una imagen base de Python
FROM python:3.9-slim

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos necesarios al contenedor
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código del backend
COPY . .

# Expone el puerto para Flask
EXPOSE 5000

# Ejecuta la aplicación Flask
CMD ["python", "app.py"]
