// En el backend (si usas Node.js/Express)
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');

//permitir peticiones de cualquier origen
app.use(cors());

// Endpoint para servir el archivo JSON
app.get('/contracts/RegistrosContract.json', (req, res) => {
  const filePath = path.join(__dirname, '..', 'build', 'contracts', 'RegistrosContract.json');
  res.sendFile(filePath);
});

// Otros endpoints y configuración del servidor
app.listen(3000, () => {
  console.log("Client server running on port 3000");
});
