import { app } from "./Firebase.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const db = getFirestore(app);

export { db }; 

export const getAllGames = async () => {
  const gamesSnapshot = await getDocs(collection(db, "Games"));
  const gamesList = [];
  gamesSnapshot.forEach((doc) => {
    gamesList.push({ id: doc.id, ...doc.data() }); 
  });
  return gamesList;
};

export const AddGame = async (id, name, description, price, imageUrl) => 
  await setDoc(doc(collection(db, "Games"), id), {
    id: id,
    name: name,
    description: description,
    price: price,
    imageUrl: imageUrl 
  });

export const getGames = async (id) => await getDoc(doc(db, "Games", id));

export const deleteGame = async (id) => 
  await deleteDoc(doc(db, "Games", id));

export const updateGameData = async (id, newData) => {
  try {
    const GameRefe = doc(db, "Games", id);
    await updateDoc(GameRefe, newData);
    console.log("Datos del videojuego actualizados correctamente.");
    return true;
  } catch (error) {
    console.error("Error al actualizar datos del videojuego:", error);
    return false;
  }
};

export const getAllUsers = async () => {
  const usersSnapshot = await getDocs(collection(db, "User"));
  const usersList = [];
  usersSnapshot.forEach((doc) => {
    usersList.push({ id: doc.id, ...doc.data() }); // Incluye el ID del documento
  });
  return usersList;
};

export const addData = async (id, fullName, email, cc, imageUrl) => 
  await setDoc(doc(collection(db, "Users"), id), {
    id: id,
    fullName: fullName,
    email: email,
    adm: false,
    cc: cc,
    imageUrl: imageUrl // Agrega la URL de la imagen
  });

// Función para obtener datos de un usuario específico
export const getData = async (id) => await getDoc(doc(db, "Users", id));

// Función para eliminar datos de un usuario
export const deleteDataUser = async (id) => 
  await deleteDoc(doc(db, "Users", id));

// Función para actualizar datos de un usuario
export const updateUserData = async (id, newData) => {
  try {
    const userRef = doc(db, "Users", id);
    await updateDoc(userRef, newData);
    console.log("Datos de usuario actualizados correctamente.");
    return true;
  } catch (error) {
    console.error("Error al actualizar datos del usuario:", error);
    return false;
  }
};