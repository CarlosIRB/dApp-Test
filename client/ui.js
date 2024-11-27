let selectedHash = null;
let selectedMetaHash = null;

const setValidationData = (textHash, metaHash) => {
  console.log("textHash ", textHash);
  console.log("metahash ", metaHash);
  selectedHash = textHash;
  selectedMetaHash = metaHash;

  const modalBody = document.querySelector("#detailModal .modal-body");

  modalBody.innerHTML = `
    <p><strong>Text Hash:</strong> ${textHash}</p>
    <p><strong>Meta Hash:</strong> ${metaHash}</p>
    <p><strong>Additional Information:</strong> more ... </p>
  `;
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();

  // crear base de datos con Dexie para almacenamiento local
  const db = new Dexie("FilesApp");
  db.version(1).stores({ todos: "++id, todo" });

  const form = document.querySelector("#new-task-form");
  const list_el = document.querySelector("#tasks");

  form.onsubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    const files = document.getElementById("new-task-input").files;
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    console.log(formData);

    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    console.log("Se subio un archivo");
    const registros = await response.json();

    for (const registro of registros) {
      await db.todos.add({ todo: registro });
      let { dateTime, id, metaHash, name, textHash } = registro;
      App.createRegistro(name, textHash, metaHash);
    }
    form.reset();
  };

  const validateFile = async () => {
    const fileInput = document.getElementById("validation-file").files[0];
    if (!fileInput) {
      alert("Please select a file to validate.");
      return;
    }
    console.log(fileInput);
    const formData = new FormData();
    formData.append("files", fileInput);
    console.log(formData);
    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });
    console.log(response);

    const registros = await response.json();
    console.log(registros);
    const { textHash, metaHash } = registros[0];
    console.log(textHash);
    console.log(selectedHash);

    let message = "";
    if (textHash == selectedHash) {
      message += "File content is valid!\n";
    } else {
      message += "File content does not match.\n";
    }
    if (metaHash == selectedMetaHash) {
      message += "File metadata is valid!\n";
    } else {
      message += "File metadata does not match.\n";
    }
    alert(message);
    const modal = new bootstrap.Modal(
      document.getElementById("validationModal")
    );
    modal.hide();
  };

  document
    .getElementById("validate-btn")
    .addEventListener("click", validateFile);
});
