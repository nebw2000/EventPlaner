import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// FIREBASE CONFIG
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

/* LOGIN */
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const password = document.getElementById("password").value;
    const error = document.getElementById("error");

    if(password === "2020"){
      window.location.href = "home.html";
    } else {
      error.classList.remove("hidden");
      setTimeout(()=>error.classList.add("hidden"),3000);
    }
  });
}

/* HAUPTSEITE */
const cards = document.getElementById("cards");

if(cards){
  const popup = document.getElementById("popup");
  const newBtn = document.getElementById("newBtn");
  const saveBtn = document.getElementById("saveBtn");

  newBtn.onclick = () => popup.classList.remove("hidden");

  saveBtn.onclick = () => {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if(!title || !content) return;

    push(ref(db,"posts"), { title, content });
    popup.classList.add("hidden");
  };

  onValue(ref(db,"posts"), snapshot => {
    cards.innerHTML = "";
    snapshot.forEach(child => {
      const data = child.val();
      const div = document.createElement("div");
      div.className = "card";
      div.textContent = data.title;
      div.onclick = () => alert(data.content);
      cards.appendChild(div);
    });
  });
}
