document.addEventListener("DOMContentLoaded", () => {
    App.init();
  });
  
  /**
   * Task form
   */
//   const taskForm = document.querySelector("#taskForm");
  
//   taskForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const title = taskForm["title"].value;
//     const description = taskForm["description"].value;
//     App.createTask(title, description);
//   });

// crear base de datos con Dexie para almacenamiento local
const db = new Dexie("FilesApp");
db.version(1).stores({ todos: "++id, todo" });

const form = document.querySelector("#new-task-form");
const list_el = document.querySelector("#tasks");

form.onsubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    const files = document.getElementById('new-task-input').files;
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    // Enviar archivos al backend
    const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData
    });
    const registros = await response.json();

    // Guardar en Dexie y actualizar la pantalla
    for (const registro of registros) {
        await db.todos.add({ todo: registro });
        let {dateTime, id, metaHash, name, textHash} = registro
        App.createRegistro(name, textHash,metaHash);
    }
    //await getTodos();
    form.reset();
};

// // mostrar lista de registros
// const getTodos = async () => {
//     const allTodos = await db.todos.reverse().toArray();

//     // Mostrar la lista de objetos en la interfaz
//     list_el.innerHTML = allTodos.map((todo) => `
//         <div class="task">
//             <div class="content">
//                 <pre>${JSON.stringify(todo.todo, null, 2)}</pre>
//             </div>
//             <div class="actions">
//                 <button class="delete" onclick="deleteTodo(${todo.id}, ${todo.todo.id})">Eliminar</button>
//             </div>
//         </div>
//     `).join("");
// };

// // eliminar registro del frontend y backend
// const deleteTodo = async (id, backendId) => {
//     // Eliminar de la base de datos local (Dexie)
//     await db.todos.delete(id);

//     // Eliminar del backend
//     await fetch(`http://127.0.0.1:5000/registros/${backendId}`, {
//         method: 'DELETE'
//     });

//     await getTodos();
// };

