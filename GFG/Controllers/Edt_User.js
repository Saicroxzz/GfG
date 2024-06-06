import { getGames } from "./Firestore.js";
import {
  onAuthChanged,
  logOut,
  deleteCurrentUser,
  sendEmailToResetPassword,
} from "./Firebase.js";
const logoutBtn = document.getElementById("logout-btn");
const BorrarCuenta = document.getElementById("delete-account-btn");
const RecuperarContraseña = document.getElementById("reset-password-btn");
const userData = document.getElementById("user-data");

document.addEventListener("DOMContentLoaded", () => {
  let currentUser;

  onAuthChanged((user) => {
    if (!user) {
      window.location.href = "../Index.html";
    } else {
      currentUser = user;
      getGames(user.uid).then((e) => {
          let data = e.data();
          userData.innerHTML = 
          `
            <h3>Cedula:</h3> ${data["cc"]} 
            <h3>Nombre:</h3> ${data["fullName"]} 
            <h3>Direcion:</h3> ${data["address"]} 
            <h3>Telefono:</h3> ${data["phone"]} 
            <h3>Correo:</h3> ${data["email"]} 
            <h3>Fecha De Naciemiento:</h3> ${data["bornDate"]} 
          `
      });
    }
  });

  logoutBtn.addEventListener("click", logOut);
  BorrarCuenta.addEventListener("click", deleteCurrentUser);
  RecuperarContraseña.addEventListener("click", () => {
    console.log(currentUser);
    sendEmailToResetPassword(currentUser.email).then(() => {
      alert("Se envio un correo para poder cambiar la contraseña");
    });
  });
});