import hashlib
import os
import textract

import pdfplumber
from docx import Document

class EncryptionService:
    def __init__(self):
        pass

    def calcular_tamano_buffer(self, tamano_archivo):
        """Determina el tamaño del buffer en función del tamaño del archivo."""
        if tamano_archivo < 1 * 1024 * 1024:  # Menor de 1 MB
            return 4096  # 4 KB
        elif tamano_archivo < 100 * 1024 * 1024:  # Entre 1 MB y 100 MB
            return 8192  # 8 KB
        else:  # Mayor de 100 MB
            return 16384  # 16 KB

    def calcular_hash(self, archivo):
        """Calcula el hash SHA-256 de un archivo tomando en cuenta la estructura binaria."""
        archivo.seek(0, 2)  # Mover al final del archivo para obtener el tamaño
        tamano_archivo = archivo.tell()
        archivo.seek(0)  # Volver al inicio del archivo

        buffer_size = self.calcular_tamano_buffer(tamano_archivo)
        
        hasher = hashlib.sha256()
        for bloque in iter(lambda: archivo.read(buffer_size), b""):
            hasher.update(bloque)
        return hasher.hexdigest()

    def calcular_hash_contenido_texto(self, archivo):
        """Calcula el hash basado únicamente en el contenido de texto de un archivo."""
        try:
            # Guardar temporalmente el archivo en el sistema de archivos
            archivo_temporal = f"./{archivo.filename}"
            archivo.save(archivo_temporal)

            # Determinar la extensión del archivo
            extension = os.path.splitext(archivo_temporal)[1].lower()

            # Extraer el contenido de texto dependiendo del tipo de archivo
            if extension == '.pdf':
                contenido = self.extraer_texto_pdf(archivo_temporal)
            elif extension == '.docx':
                contenido = self.extraer_texto_docx(archivo_temporal)
            else:
                os.remove(archivo_temporal)
                return f"Formato de archivo no soportado: {extension}"

            # Calcular el hash del contenido de texto
            hasher = hashlib.sha256()
            hasher.update(contenido.encode('utf-8'))

            # Eliminar el archivo temporal después de usarlo
            os.remove(archivo_temporal)

            return hasher.hexdigest()

        except Exception as e:
            return f"Error procesando el contenido de texto: {e}"

    def extraer_texto_pdf(self, archivo_path):
        """Extrae el contenido de texto de un archivo PDF usando pdfplumber."""
        contenido = ""
        with pdfplumber.open(archivo_path) as pdf:
            for page in pdf.pages:
                contenido += page.extract_text()
        return contenido

    def extraer_texto_docx(self, archivo_path):
        """Extrae el contenido de texto de un archivo DOCX usando python-docx."""
        contenido = ""
        doc = Document(archivo_path)
        for paragraph in doc.paragraphs:
            contenido += paragraph.text
        return contenido