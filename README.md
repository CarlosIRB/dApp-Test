# med-blockchain

**Proyecto de aplicación descentralizada (dApp) para el manejo seguro de registros médicos utilizando tecnología blockchain.**

## Resumen
**med-blockchain** es una solución blockchain para el almacenamiento y gestión seguros de registros médicos. Utiliza la red Ethereum para garantizar la integridad y privacidad de información médica sensible.

## Tecnologías utilizadas
- **Lenguaje principal**: JavaScript (Node.js)
- **Frameworks**:
  - Truffle para desarrollo y despliegue de contratos inteligentes

### Redes:
- Ethereum para almacenamiento de contratos inteligentes
- Ganache para simular una red blockchain local

## Características principales
- Almacenamiento seguro de registros médicos en la blockchain
- Autenticación y autorización basada en criptomonedas
- Integración con MetaMask para gestión de billeteras

## Requisitos previos
- Node.js instalado en tu sistema
- Truffle instalado globalmente (`npm install -g truffle`)
- Ganache corriendo en tu máquina local

## Instrucciones de ejecución

1. Clonar el repositorio:
   ```bash
   `git clone https://github.com/tu_usuario/med-blockchain.git`
   cd med-blockchain

2. Instalar dependencias:
`npm install`

3. Preparar ambiente Ganache:
Inicia Ganache en tu máquina local
Obtiene las direcciones de 10 cuentas simuladas de Ganache

4. Compilar contratos inteligentes:
   `truffle compile`

5. Configurar MetaMask:
Abre MetaMask
Agrega una nueva red personalizada (RPC URL: http://localhost:7545)
Importa una de las 10 direcciones de Ganache como cuenta principal

6. Ejecutar migraciones:
   `truffle migrate`

7. Correr el servidor de desarrollo:
   `lite-server --config bs-config.json`

8. Abrir la aplicación en tu navegador:
Ve a http://localhost:3001 en tu navegador (o lo definido en bs-config.json)

Pasos adicionales en el navegador
Conecta MetaMask a la red personalizada de Ganache
Acepta la transacción inicial para crear el contrato Registros
Usa la interfaz para registrar nuevos registros médicos
Verifica el estado de tus registros en la interfaz
Comandos útiles
Compilar contratos: truffle compile
Migrar contratos: truffle migrate
Actualizar contratos: truffle migrate --reset
Verificar estado del contrato: truffle exec scripts/check_contract.js
Despliegue
Para desplegar en una red real Ethereum:

Configura una cuenta de depósito en MyEtherWallet
Realiza una transacción de depósito a la dirección del contrato
Ejecuta las migraciones en una red pública:
   truffle migrate --network mainnet
Contribuciones
Contribuciones bienvenidas! Consulta el archivo CONTRIBUTING.md para detalles sobre cómo contribuir.

