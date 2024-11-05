from flask import Flask, request, jsonify
from flask_cors import CORS
from encryption_service import EncryptionService
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Permitir todos los CORS

# Instancia de la clase EncryptionService
encryption_service = EncryptionService()

# Arreglo para almacenar los registros
registros = []
next_id = 1  # ID incremental para los registros

@app.route('/upload', methods=['POST'])
def upload_file():
    global next_id
    archivos = request.files.getlist('files')
    resultados = []
    for archivo in archivos:
        archivo.seek(0)
        try:
            # Obtener los hashes
            text_hash = encryption_service.calcular_hash_contenido_texto(archivo)
            archivo.seek(0)
            meta_hash = encryption_service.calcular_hash(archivo)

            # Crear un registro con la estructura solicitada
            registro = {
                "id": next_id,
                "name": archivo.filename,
                "textHash": text_hash,
                "metaHash": meta_hash,
                "dateTime": datetime.now().isoformat()
            }

            # Agregar el registro al arreglo
            registros.append(registro)
            next_id += 1

            # Guardar resultado
            resultados.append(registro)

        except Exception as e:
            resultados.append(f"Error procesando {archivo.filename}: {e}")

    return jsonify(resultados)

@app.route('/registros', methods=['GET'])
def obtener_registros():
    """Devuelve todos los registros."""
    return jsonify(registros)

@app.route('/registros/<int:registro_id>', methods=['DELETE'])
def eliminar_registro(registro_id):
    """Elimina un registro por ID."""
    global registros
    registros = [r for r in registros if r['id'] != registro_id]
    return jsonify({"message": "Registro eliminado"}), 200

if __name__ == '__main__':
    app.run(debug=True)
