// const resp = fetch("https://reqres.in/api/users?page=2");
// console.log(resp);
// resp
//   .then((response) => response.json())
//   .then((json) => {
//     let content = document.getElementById("container");
//     let htmlX = "";
//     json.data.forEach((element) => {
//       console.log(element);

//       let htmlCard = `<div class="card" style="width: 300px;" id="user-card-${element.id}">
//         <div class="card-body" style="width: 200px;">
//           <img src="${element.avatar}" alt="" width="200px" height="200px">
//           <h5>Email: ${element.email}</h5>
//           <button type="button" data-bs-toggle="modal" data-bs-target="#details" class="btn btn-info center" onclick="findById(${element.id})">Detalles</button>
//           <br>
//           <button type="button" data-bs-toggle="modal" data-bs-target="#details" class="btn btn-danger" onclick="deleteId(${element.id})">Eliminar</button>
//         </div>
//       </div>`;
//       // Concatenar la tarjeta actual al contenido HTML
//       htmlX += htmlCard;
//     });
//     content.innerHTML = htmlX;
//   });


// const findById = (id) => {
//   fetch("https://reqres.in/api/users/" + id)
//     .then((response) => response.json())
//     .then((json) => {
//       console.log(json.data);
//       document.getElementById("name").innerHTML = json.data.first_name;
//       document.getElementById("last").innerHTML = json.data.last_name;
//       document.getElementById("email").innerHTML = json.data.email;
//       document.getElementById("avatar").src = json.data.avatar;
//     });
// };

// const deleteId = (id) => {
//   // Hacer una solicitud DELETE a la API para eliminar el usuario
//   fetch(`https://reqres.in/api/users/${id}`, {
//     method: 'DELETE',
//   })
//     .then((response) => {
//       if (response.status === 204) {
//         // Si la solicitud se completó con éxito (204 No Content), eliminar la tarjeta del DOM
//         const cardToDelete = document.getElementById(`user-card-${id}`);
//         if (cardToDelete) {
//           cardToDelete.remove();
//         }
//       } else {
//         // Manejar cualquier error que pueda ocurrir durante la eliminación
//         console.error("Error al eliminar el usuario");
//       }
//     })
//     .catch((error) => {
//       console.error("Error al realizar la solicitud DELETE", error);
//     });
// };

const resp = fetch("https://reqres.in/api/users?page=2");
// console.log(resp);
resp
  .then((response) => response.json())
  .then((json) => {
    let content = document.getElementById("container");
    let htmlX = "";
    json.data.forEach((element) => {
      // console.log(element);

      let htmlCard = `<div class="card" style="width: 300px;" id="user-card-${element.id}">
        <div class="card-body" style="width: 200px;">
          <img src="${element.avatar}" alt="" width="200px" height="200px">
          <h5>Email: ${element.email}</h5>
          <button type="button" data-bs-toggle="modal" data-bs-target="#details" class="btn btn-info center" onclick="findById(${element.id})">Detalles</button>
          <button type="button" class="btn btn-danger" onclick="confirmDelete(${element.id})">Eliminar</button>
          <br>
          <button type="button" class="btn btn-success" data-user-id="${element.id}" onclick="abrirActualizarModal(${element.id})">Actualizar</button>

        </div>
      </div>`;
      htmlX += htmlCard;
    });
    content.innerHTML = htmlX;
  });

const findById = (id) => {
  fetch("https://reqres.in/api/users/" + id)
    .then((response) => response.json())
    .then((json) => {
      // console.log(json.data);
      document.getElementById("name").innerHTML = json.data.first_name;
      document.getElementById("last").innerHTML = json.data.last_name;
      document.getElementById("email").innerHTML = json.data.email;
      document.getElementById("avatar").src = json.data.avatar;
    });
};

const confirmDelete = (id) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteId(id);
    }
  });
};

const deleteId = (id) => {
  fetch(`https://reqres.in/api/users/${id}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.status === 204) {
        const cardToDelete = document.getElementById(`user-card-${id}`);
        if (cardToDelete) {
          cardToDelete.remove();
          Swal.fire(
            '¡Registro eliminado!',
            'El registro ha sido eliminado correctamente.',
            'success'
          );
        }
      } else {
        console.error("Error al eliminar el usuario");
      }
    })
    .catch((error) => {
      console.error("Error al realizar la solicitud DELETE", error);
    });
};

const abrirCrearModal = () => {
  // Limpiar los campos del formulario antes de abrir el modal
  document.getElementById("email").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("apellido").value = "";
  // document.getElementById("imagen").value = null;

  // Abrir el modal
  const modal = new bootstrap.Modal(document.getElementById("crearModal"));
  modal.show();
};

const crearUsuario = () => {
  const email = document.getElementById("email").value;
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;

  const formData = new FormData();
  formData.append("email", email);
  formData.append("first_name", nombre);
  formData.append("last_name", apellido);

  fetch("https://reqres.in/api/users", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.status === 201) {
        Swal.fire({
          title: "¡Registro exitoso!",
          text: "El usuario ha sido creado correctamente.",
          icon: "success",
        }).then(() => {
          const modal = new bootstrap.Modal(document.getElementById("crearModal"));
          modal.hide();

          // Ocultar las cards después de registrar un usuario
          const cards = document.querySelectorAll(".card");
          cards.forEach((card) => {
            card.classList.add("hidden");
          });
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Hubo un error al crear el usuario.",
          icon: "error",
        });
      }
    })
    .catch((error) => {
      console.error("Error al realizar la solicitud POST", error);
    });
};


const abrirActualizarModal = (userId) => {
  // Obtener los datos actuales del usuario mediante una solicitud GET
  fetch(`https://reqres.in/api/users/${userId}`)
    .then((response) => response.json())
    .then((json) => {
      // Llenar el formulario de actualización con los datos actuales del usuario
      document.getElementById("updateEmail").value = json.data.email;
      document.getElementById("updateNombre").value = json.data.first_name;
      document.getElementById("updateApellido").value = json.data.last_name;

      // Abrir el modal de actualización
      const modal = new bootstrap.Modal(document.getElementById("actualizarModal"));
      modal.show();
    });
};


const actualizarUsuario = () => {
  
  const email = document.getElementById("updateEmail").value;
  const nombre = document.getElementById("updateNombre").value;
  const apellido = document.getElementById("updateApellido").value;

  const formData = new FormData();
  formData.append("email", email);
  formData.append("first_name", nombre);
  formData.append("last_name", apellido);

  fetch(`https://reqres.in/api/users/${userId}`, {
    method: "PUT",
    body: formData,
  })
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          title: "¡Actualización exitosa!",
          text: "Los datos del usuario han sido actualizados correctamente.",
          icon: "success",
        }).then(() => {
          const modal = new bootstrap.Modal(document.getElementById("actualizarModal"));
          modal.hide();
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Hubo un error al actualizar los datos del usuario.",
          icon: "error",
        });
      }
    })
    .catch((error) => {
      console.error("Error al realizar la solicitud PUT", error);
    });
};




