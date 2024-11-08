#!/bin/bash
# Espera a que Ganache esté disponible en el puerto 7545
while ! nc -z $GANACHE_HOST $GANACHE_PORT; do
  echo "Esperando a que Ganache esté disponible en $GANACHE_HOST:$GANACHE_PORT..."
  sleep 2
done

echo "Ganache está activo en $GANACHE_HOST:$GANACHE_PORT. Ejecutando truffle migrate..."

truffle migrate --network development