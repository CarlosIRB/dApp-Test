let registros = [];
App = {
  contracts: {},
  init: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
    await App.renderRegistros();
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
      const res = await fetch(
        `http://localhost:3000/contracts/RegistrosContract.json`
      );
      const registrosContractJSON = await res.json();
      console.log(registrosContractJSON);
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
    registros = [];

    for (let i = 1; i <= registrosCounterNumber; i++) {
      try {
        const registro = await App.registrosContract.getRegistro(i);

        const registroId = registro[0];
        const registroName = registro[1];
        const registroTextHash = registro[2];
        const registroMetaHash = registro[3];
        const registroCreatedAt = registro[4];

        if (registroId > 0) {
          registros.push({
            id: registroId,
            name: registroName,
            textHash: registroTextHash,
            metaHash: registroMetaHash,
            createdAt: registroCreatedAt,
          });

          let registroElement = `<div class="card bg-dark mb-2" data-name="${registroName}" data-date="${registroCreatedAt}">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>${registroName}</span>
        <p class="text-muted">${
          registroCreatedAt > 0
            ? "Created at " +
              new Date(registroCreatedAt * 1000).toLocaleString()
            : ""
        }</p>
        <hr/>
        </div>
        <div class="card-body">
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#detailModal" onclick="setValidationData('${registroTextHash}','${registroMetaHash}')">View Details</button>
          <hr/>
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#validationModal" onclick="setValidationData('${registroTextHash}','${registroMetaHash}')">Validate</button>
          <button class="btn btn-danger btn-sm" data-id="${registroId}" onclick="App.deleteRegistro(${registroId})">Eliminar</button>
        </div>
      </div>`;

          html += registroElement;
        }
      } catch (error) {
        console.error(`Error al obtener el registro con ID ${i}:`, error);
      }
    }

    document.querySelector("#registros").innerHTML = html;
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
      await App.renderRegistros();
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

function searchRegistros() {
  const searchQuery = document.getElementById("search").value.toLowerCase(); 
  const filteredRegistros = registros.filter((registro) => {
    const nameMatch = registro.name.toLowerCase().includes(searchQuery);
    const dateMatch = new Date(registro.createdAt * 1000)
      .toLocaleString()
      .toLowerCase()
      .includes(searchQuery);
    return nameMatch || dateMatch;
  });

  renderFilteredRegistros(filteredRegistros);
}

function renderFilteredRegistros(filteredRegistros) {
  let html = "";
  filteredRegistros.forEach((registro) => {
    let registroElement = `<div class="card bg-dark mb-2">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span>${registro.name}</span>
      <p class="text-muted">${
        registro.createdAt > 0
          ? "Created at " + new Date(registro.createdAt * 1000).toLocaleString()
          : ""
      }</p>
      <hr/>
      </div>
      <div class="card-body">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#detailModal" onclick="setValidationData('${
          registro.textHash
        }','${registro.metaHash}')">View Details</button>
        <hr/>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#validationModal" onclick="setValidationData('${
          registro.textHash
        }','${registro.metaHash}')">Validate</button>
        <button class="btn btn-danger btn-sm" data-id="${
          registro.id
        }" onclick="App.deleteRegistro(${registro.id})">Eliminar</button>
      </div>
    </div>`;
    html += registroElement;
  });

  document.querySelector("#registros").innerHTML = html;
}
