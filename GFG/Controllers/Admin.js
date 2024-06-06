import {getAllGames, AddGame, deleteGame, getGames, updateGameData, db} from "./Firestore.js";
import { logOut, Img,} from "./Firebase.js";

const logoutBtn = document.getElementById("logout-btn");
const createGameBtn = document.getElementById("create-game-btn");
const GamesListElement = document.getElementById("Game-list");

logoutBtn.addEventListener("click", () => {
  logOut().then(() => {
    window.location.href = "../Index.html";
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    GamesListElement.innerHTML = "";

    const Games = await getAllGames();
    renderGames(Games);

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Buscar por nombre";
    const searchBtn = document.createElement("button");
    searchBtn.textContent = "Buscar";
    searchBtn.addEventListener("click", async () => {
      const searchValue = searchInput.value.trim().toLowerCase();
      const filteredGames = Games.filter(Game => Game.name.toLowerCase().includes(searchValue));
      filteredGames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      renderGames(filteredGames);
    });

    GamesListElement.appendChild(searchInput);
    GamesListElement.appendChild(searchBtn);
  } catch (error) {
    console.error("Error al obtener la lista de videojuegos:", error);
  }
});

createGameBtn.addEventListener("click", async () => {
  const card = document.createElement("div");
  card.className = "card";

  const form = document.createElement("form");

  const table = document.createElement("table");

  const nameRow = table.insertRow();
  const nameLabel = nameRow.insertCell();
  nameLabel.textContent = "Nombre:";
  const nameInputCell = nameRow.insertCell();
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "Game-name";
  nameInput.name = "GameName";
  nameInputCell.appendChild(nameInput);

  const descriptionRow = table.insertRow();
  const descriptionLabel = descriptionRow.insertCell();
  descriptionLabel.textContent = "Descripción:";
  const descriptionInputCell = descriptionRow.insertCell();
  const descriptionInput = document.createElement("input");
  descriptionInput.type = "text";
  descriptionInput.id = "description";
  descriptionInput.name = "description";
  descriptionInputCell.appendChild(descriptionInput);

  const priceRow = table.insertRow();
  const priceLabel = priceRow.insertCell();
  priceLabel.textContent = "Precio:";
  const priceInputCell = priceRow.insertCell();
  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.id = "price";
  priceInput.name = "price";
  priceInputCell.appendChild(priceInput);

  const imageRow = table.insertRow();
  const imageLabel = imageRow.insertCell();
  imageLabel.textContent = "Imagen:";
  const imageInputCell = imageRow.insertCell();
  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.id = "fileimg";
  imageInput.name = "fileimg";
  imageInputCell.appendChild(imageInput);

  const createButton = document.createElement("button");
  createButton.textContent = "Crear Videojuego";
  createButton.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const urlimagen = document.getElementById('fileimg').files[0];
      let imageUrl = '';
      if (urlimagen) {
        imageUrl = await Img(urlimagen, nameInput.value);
      }

      await AddGame(Date.now().toString(), nameInput.value, descriptionInput.value, priceInput.value, imageUrl);
      alert("Videojuego creado correctamente.");
      card.remove();
    } catch (error) {
      console.error("Error al crear el Videojuego:", error);
      alert("Error al crear el Videojuego. Consulte la consola para más detalles.");
    }
  });

  form.appendChild(table);
  form.appendChild(createButton);
  card.appendChild(form);
  GamesListElement.appendChild(card);
});

async function deleteGameData(GameId) {
  console.log("Tratando de borrar");

  try {
    await deleteGame(GameId);
    alert("Videojuego eliminado.");
    location.reload();
  } catch (error) {
    console.error("Error al eliminar datos del Videojuego:", error.code);

    switch (error.code) {
      case 'permission-denied':
        alert("Permisos insuficientes para eliminar el Videojuego.");
        break;
      case 'not-found':
        alert("Videojuego no encontrado.");
        break;
      default:
        alert("Error al eliminar Videojuego: " + error.message);
        break;
    }
  }
}

async function editGame(GameId) {
  const GameData = await getGames(GameId);

  const card = document.createElement("div");
  card.className = "card";

  const form = document.createElement("form");

  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Nombre:";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = GameData.name || '';
  nameInput.id = "edit-Game-name";
  nameInput.name = "editGameName";

  const descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Descripción:";
  const descriptionInput = document.createElement("input");
  descriptionInput.type = "text";
  descriptionInput.value = GameData.description || '';
  descriptionInput.id = "edit-description";
  descriptionInput.name = "editdescription";

  const priceLabel = document.createElement("label");
  priceLabel.textContent = "Precio:";
  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.value = GameData.price || '';
  priceInput.id = "edit-price";
  priceInput.name = "editPrice";

  const imageLabel = document.createElement("label");
  imageLabel.textContent = "Imagen:";
  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.id = "edit-fileimg";
  imageInput.name = "editFileimg";

  const updateButton = document.createElement("button");
  updateButton.textContent = "Actualizar";
  updateButton.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const newData = {};
  
      if (nameInput.value.trim() !== '') {
        newData.name = nameInput.value;
      }
      if (descriptionInput.value.trim() !== '') {
        newData.description = descriptionInput.value;
      }
      if (priceInput.value.trim() !== '') {
        newData.price = priceInput.value;
      }
  
      const newImage = document.getElementById('edit-fileimg').files[0];
      if (newImage) {
        const imageURL = await Img(newImage, GameData.name);
        newData.imageUrl = imageURL;
      }
  
      if (Object.keys(newData).length !== 0) {
        await updateGameData(GameId, newData);
        alert("Datos del Videojuego actualizados correctamente.");
        location.reload();
      } else {
        alert("No se han realizado cambios.");
      }
    } catch (error) {
      console.error("Error al actualizar datos del Videojuego:", error.message);
      alert("Error al actualizar datos del Videojuego. Consulte la consola para más detalles.");
    }
  });

  form.appendChild(nameLabel);
  form.appendChild(nameInput);
  form.appendChild(descriptionLabel);
  form.appendChild(descriptionInput);
  form.appendChild(priceLabel);
  form.appendChild(priceInput);
  form.appendChild(imageLabel);
  form.appendChild(imageInput);
  form.appendChild(updateButton);
  card.appendChild(form);

  GamesListElement.appendChild(card);
}

function renderGames(Games) {
  GamesListElement.innerHTML = "";
  Games.forEach((Game) => {
    const listItem = document.createElement("li");
    listItem.className = "Game-list-item";

    if (Game.imageUrl) {
      const GameImage = document.createElement("img");
      GameImage.src = Game.imageUrl;
      GameImage.alt = `Imagen de ${Game.name}`;
      GameImage.className = "Game-image";
      listItem.appendChild(GameImage);
    }

    const GameInfo = document.createElement("div");
    GameInfo.textContent = `ID: ${Game.id}, Nombre: ${Game.name}, Descripción: ${Game.description}, Precio: ${Game.price}`;
    GameInfo.className = "Game-info";

    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.className = "edit-button";
    editButton.addEventListener("click", () => editGame(Game.id));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", () => deleteGameData(Game.id));

    listItem.appendChild(GameInfo);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    GamesListElement.appendChild(listItem);
  });
}