App = {
  contracts: {},
  init: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
    await App.renderRegistros(); // Llamada a la nueva función para renderizar los registros
  },
  loadWeb3: async () => {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("No ethereum browser is installed. Try installing MetaMask.");
    }
    console.log("web3 initialized");
  },
  loadAccount: async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    App.account = accounts[0];
    console.log("account loaded");
  },
  loadContract: async () => {
    try {
      console.log("loading contract");
      const res = await fetch(`http://localhost:3000/contracts/RegistrosContract.json`);
      const registrosContractJSON = await res.json();
      App.contracts.RegistrosContract = TruffleContract(registrosContractJSON);
      App.contracts.RegistrosContract.setProvider(App.web3Provider);

      App.registrosContract = await App.contracts.RegistrosContract.deployed();
    } catch (error) {
      console.log("Loading contract error");
      console.error(error);
    }
  },
  render: async () => {
    document.getElementById("account").innerText = App.account;
  },
  renderRegistros: async () => {
    console.log("rendering registros");
    const registrosCounter = await App.registrosContract.registrosCounter();
    const registrosCounterNumber = registrosCounter.toNumber();

    let html = "";

    for (let i = 1; i <= registrosCounterNumber; i++) {
      try {
        const registro = await App.registrosContract.getRegistro(i);
 
        const registroId = registro[0];
        const registroName = registro[1];
        const registroTextHash = registro[2];
        const registroMetaHash = registro[3];
        const registroCreatedAt = registro[4];

        if (registroId > 0) {

          // Crear un elemento de registro con un botón de eliminar
          let registroElement = `<div class="card bg-dark mb-2">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>${registroName}</span>
            <button class="btn btn-danger btn-sm" data-id="${registroId}" onclick="App.deleteRegistro(${registroId})">Eliminar</button>
          </div>
          <div class="card-body">
            <p><strong>Text Hash:</strong> ${registroTextHash}</p>
            <p><strong>Meta Hash:</strong> ${registroMetaHash}</p>
            <p class="text-muted">${
              registroCreatedAt > 0
                ? "Created at " +
                  new Date(registroCreatedAt * 1000).toLocaleString()
                : ""
            }</p>
          </div>
        </div>`;

          html += registroElement;
        }
      } catch (error) {
        console.error(`Error al obtener el registro con ID ${i}:`, error);
      }
    }

    document.querySelector("#registros").innerHTML = html; // Asegúrate de tener un contenedor con este ID
  },
  createRegistro: async (name, textHash, metaHash) => {
    try {
      const result = await App.registrosContract.createRegistro(
        name,
        textHash,
        metaHash,
        {
          from: App.account,
        }
      );
      console.log(result.logs[0].args);
      window.location.reload();
      await App.renderRegistros()
    } catch (error) {
      console.error(error);
    }
  },
  deleteRegistro: async (id) => {
    try {
      await App.registrosContract.deleteRegistro(id, {
        from: App.account,
      });
      window.location.reload();
    } catch (error) {
      console.error(`Error al eliminar el registro con ID ${id}:`, error);
    }
  },
};
