import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyCBAlNptBhwxVxG40kTCT8afThLLb8JwmE",
  authDomain: "proyecto-final-243ab.firebaseapp.com",
  projectId: "proyecto-final-243ab",
  storageBucket: "proyecto-final-243ab.appspot.com",
  messagingSenderId: "582610496634",
  appId: "1:582610496634:web:31741bb8d1d17372df1fc3",
  measurementId: "G-R6BWPPVQXH"
};

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export const signInPopup = (provider) => signInWithPopup(auth, provider);

export const sendEmailToResetPassword = (email) => sendPasswordResetEmail(auth, email);
export const sendEmail = (user) => sendEmailVerification(user);
export const logOut = async () => signOut(auth);

export const signinEmailPassword = async (email, password) => signInWithEmailAndPassword(auth, email, password);

export const createUserEmailPassword = async (email, password) => createUserWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = async (email, password) => createUserWithEmailAndPassword(auth, email, password);

export const loginWithFacebook = async (email, password) => createUserWithEmailAndPassword(auth, email, password);

export const onAuthChanged = (user) => onAuthStateChanged(auth, user);

export const deleteCurrentUser = async () => auth.currentUser.delete();

// Storage

export const Img = async (file, referencia) => {
  const storageref = ref(storage, `avatars/${referencia}/${file.name}`);
  await uploadBytes(storageref, file);
  const url = await getDownloadURL(storageref);
  return url;
};