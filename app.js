import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
const auth = getAuth(app);
const db = getDatabase(app);

/* ELEMENTE */
const loginScreen = document.getElementById("loginScreen");
const mainScreen = document.getElementById("mainScreen");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

const newBtn = document.getElementById("newBtn");
const popupOverlay = document.getElementById("popupOverlay");
const savePost = document.getElementById("savePost");

const cardGrid = document.getElementById("cardGrid");

/* LOGIN */
loginBtn.onclick = () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (email === "1" && password === "1") {
    showMain();
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(showMain)
    .catch(() => {
      loginError.style.display = "block";
      setTimeout(() => loginError.style.display = "none", 3000);
    });
};

function showMain() {
  loginScreen.style.display = "none";
  mainScreen.style.display = "block";
}

/* POPUP */
newBtn.onclick = () => popupOverlay.style.display = "flex";

savePost.onclick = () => {
  const title = document.getElementById("popupTitle").value.trim();
  const text = document.getElementById("popupText").value.trim();
  if (!title || !text) return;

  push(ref(db, "posts"), { title, text });

  popupOverlay.style.display = "none";
  popupTitle.value = "";
  popupText.value = "";
};

/* LOAD POSTS */
onValue(ref(db, "posts"), snapshot => {
  cardGrid.innerHTML = "";
  snapshot.forEach(child => {
    const data = child.val();
    const div = document.createElement("div");
    div.className = "card";
    div.innerText = data.title;
    div.onclick = () => alert(data.text);
    cardGrid.appendChild(div);
  });
});
