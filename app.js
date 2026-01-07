import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

/* FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyA77Epd0AXYz41c47nXuJHP2EKqWbuneb4",
  authDomain: "gyraevent.firebaseapp.com",
  databaseURL: "https://gyraevent-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gyraevent",
  storageBucket: "gyraevent.firebasestorage.app",
  messagingSenderId: "1055376556998",
  appId: "1:1055376556998:web:cf91c05b247fcd8450a8c7"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* ELEMENTE */
const loginPage = document.getElementById("loginPage");
const mainPage = document.getElementById("mainPage");
const loginBtn = document.getElementById("loginBtn");
const errorBox = document.getElementById("loginError");

const newBtn = document.getElementById("newBtn");
const popup = document.getElementById("popup");
const saveBtn = document.getElementById("saveBtn");

const titleInput = document.getElementById("titleInput");
const textInput = document.getElementById("textInput");
const cards = document.getElementById("cards");

/* LOGIN */
loginBtn.onclick = () => {
  const user = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  if (user === "1" && pass === "1") {
    loginPage.classList.add("hidden");
    mainPage.classList.remove("hidden");
  } else {
    errorBox.style.display = "block";
    setTimeout(() => errorBox.style.display = "none", 3000);
  }
};

/* POPUP */
newBtn.onclick = () => popup.classList.remove("hidden");

saveBtn.onclick = () => {
  if (!titleInput.value || !textInput.value) return;

  push(ref(db, "posts"), {
    title: titleInput.value,
    text: textInput.value
  });

  titleInput.value = "";
  textInput.value = "";
  popup.classList.add("hidden");
};

/* LADEN */
onValue(ref(db, "posts"), snapshot => {
  cards.innerHTML = "";
  snapshot.forEach(child => {
    const data = child.val();
    const div = document.createElement("div");
    div.className = "card";
    div.innerText = data.title;
    div.onclick = () => alert(data.text);
    cards.appendChild(div);
  });
});
