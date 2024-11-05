// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract RegistrosContract {
    uint256 public registrosCounter = 0;

    struct Registro {
        uint256 id;
        string name;
        string textHash;
        string metaHash;
        uint256 createdAt;
    }

    event RegistroCreated(
        uint256 id,
        string name,
        string textHash,
        string metaHash,
        uint256 createdAt
    );

    event RegistroDeleted(uint256 id);

    mapping(uint256 => Registro) public registros;

    // Función para crear un nuevo registro
    function createRegistro(string memory _name, string memory _textHash, string memory _metaHash) public {
        registrosCounter++;
        registros[registrosCounter] = Registro(
            registrosCounter,
            _name,
            _textHash,
            _metaHash,
            block.timestamp
        );
        emit RegistroCreated(
            registrosCounter,
            _name,
            _textHash,
            _metaHash,
            block.timestamp
        );
    }

    // Función para obtener un registro por ID
    function getRegistro(uint256 _id) public view returns (Registro memory) {
        require(_id > 0 && _id <= registrosCounter, "Registro no encontrado");
        return registros[_id];
    }

    // Función para eliminar un registro por ID
    function deleteRegistro(uint256 _id) public {
        require(_id > 0 && _id <= registrosCounter, "Registro no encontrado");
        delete registros[_id];
        emit RegistroDeleted(_id);
    }
}
