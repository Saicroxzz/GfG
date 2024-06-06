import { getAllGames } from "./Firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const productsListElement = document.getElementById("products-list");

    try {
        const Games = await getAllGames(); // Asegúrate de que esta función devuelva una lista de Videojuegos
        renderGames(Games);
    } catch (error) {
        console.error("Error al obtener la lista de Videojuegos:", error);
    }

    function renderGames(Games) {
        productsListElement.innerHTML = "";
        Games.forEach(Game => {
            const listItem = document.createElement("li");
            listItem.className = "product-list-item";

            if (Game.imageUrl) {
                const GameImage = document.createElement("img");
                GameImage.src = Game.imageUrl;
                GameImage.alt = `Imagen de ${Game.name}`;
                GameImage.className = "product-image";
                listItem.appendChild(GameImage);
            }

            const GameInfo = document.createElement("div");
            GameInfo.textContent = `Nombre: ${Game.name}, Precio: $${Game.price}`;
            GameInfo.className = "product-info";

            const detailsButton = document.createElement("button");
            detailsButton.textContent = "Detalles";
            detailsButton.className = "details-button";
            detailsButton.addEventListener("click", () => showProductDetails(Game.name, Game.description, `$${Game.price}`, Game.imageUrl));

            listItem.appendChild(GameInfo);
            listItem.appendChild(detailsButton);

            productsListElement.appendChild(listItem);
        });
    }
});