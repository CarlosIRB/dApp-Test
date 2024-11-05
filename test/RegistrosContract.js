const RegistrosContract = artifacts.require("RegistrosContract");

contract("RegistrosContract", (accounts) => {
  before(async () => {
    this.registrosContract = await RegistrosContract.deployed();
  });

  it("should deploy the contract successfully", async () => {
    const address = await this.registrosContract.address;

    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
  });

  it("should create a new registro successfully", async () => {
    // Crear un registro
    const result = await this.registrosContract.createRegistro(
      "documento.txt",
      "hashTexto",
      "hashMeta",
      { from: accounts[0] }
    );
    const event = result.logs[0].args;
    const registrosCounter = await this.registrosContract.registrosCounter();

    // Verificar que el registro se creó correctamente
    assert.equal(registrosCounter.toNumber(), 1);
    assert.equal(event.id.toNumber(), 1);
    assert.equal(event.name, "documento.txt");
    assert.equal(event.textHash, "hashTexto");
    assert.equal(event.metaHash, "hashMeta");
  });

  it("should get a registro by ID", async () => {
    // Obtener un registro por su ID
    const registroCounter = await this.registrosContract.registrosCounter();
    const registro = await this.registrosContract.registros(registroCounter);

    // Verificar que los datos sean correctos
    assert.equal(registro.id.toNumber(), registroCounter.toNumber());
    assert.equal(registro.name, "documento.txt");
    assert.equal(registro.textHash, "hashTexto");
    assert.equal(registro.metaHash, "hashMeta");
  });

  it("should delete a registro successfully", async () => {
    // Eliminar el registro con ID 1
    const result = await this.registrosContract.deleteRegistro(1, {
      from: accounts[0],
    });
    const event = result.logs[0].args;

    // Verificar que el evento de eliminación sea correcto
    assert.equal(event.id.toNumber(), 1);

  });
});
