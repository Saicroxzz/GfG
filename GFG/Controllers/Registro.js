import { addData } from "./Firestore.js";
import { createUserEmailPassword, sendEmail } from "./Firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("signin-btn");
  const Cedula = document.getElementById("User-Cedula");
  const Nombre = document.getElementById("User-Nombre");
  const Direccion = document.getElementById("User-Direccion");
  const Telefono = document.getElementById("User-Telefono");
  const Correo = document.getElementById("User-Correo");
  const Fecha = document.getElementById("User-Fecha");
  const Contraseña = document.getElementById("User-Contraseña");
  const passwordAlert = document.getElementById("password-alert");

  function ValidarContraseña(e) {
    let value = e.target.value;
    if (value.length < 8) {
      passwordAlert.innerHTML = `La contraseña debe tener mas de 8 caracteres`;
    } else if (/[^a-zA-Z0-9\-\/]/.test(value)) {
      passwordAlert.innerHTML = `La contraseña no puede tener caracteres especiales`;
    } else {
      passwordAlert.innerHTML = ``;
    }
  }

  async function signIn() {
    let user = null;
    await createUserEmailPassword(Correo.value.trim(), Contraseña.value)
      .then((userCredential) => {
        user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });

    await sendEmail(user)
      .then(() => {
        alert("Se envio un correo de verificacion");
      })
      .catch((error) => {
        alert(error);
      });

    await addData(
      user.uid,
      Cedula.value,
      Nombre.value,
      Direccion.value,
      Telefono.value,
      Correo.email,
      Fecha.value
    )
      .then(() => {
        alert("Los datos se guardaron en la base de datos");
      })
      .catch((e) => {
        alert("Error al guardar datos en la base de datos");
        alert(e);
      });
    window.location.href = "../Index.html";
  }

  signInBtn.addEventListener("click", signIn);
  Contraseña.addEventListener("input", ValidarContraseña);
});