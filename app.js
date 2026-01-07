import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

/* ===== LOGIN ===== */
const loginBtn = document.getElementById("loginBtn");
if(loginBtn){
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

/* ===== HAUPTSEITE ===== */
const cards = document.getElementById("cards");
if(cards){
  const popup = document.getElementById("popup");
  const newBtn = document.getElementById("newBtn");
  const saveBtn = document.getElementById("saveBtn");
  const viewPopup = document.getElementById("viewPopup");
  const viewTitle = document.getElementById("viewTitle");
  const viewContent = document.getElementById("viewContent");
  const deleteBtn = document.getElementById("deleteBtn");
  const deletePassword = document.getElementById("deletePassword");
  const closeView = document.getElementById("closeView");

  newBtn.onclick = () => popup.classList.remove("hidden");

  saveBtn.onclick = () => {
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    if(!title || !content) return alert("Bitte Titel und Text eingeben");

    push(ref(db,"posts"), { title, content })
      .then(()=>{
        popup.classList.add("hidden");
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";
      })
      .catch(err=>alert("Fehler beim Speichern: "+err));
  };

  const postsRef = ref(db,"posts");
  onValue(postsRef, snapshot => {
    cards.innerHTML = "";
    snapshot.forEach(child => {
      const data = child.val();
      const key = child.key;
      const div = document.createElement("div");
      div.className = "card";
      div.textContent = data.title;

      // Popup mit Inhalt + Löschen
      div.onclick = () => {
        viewPopup.classList.remove("hidden");
        viewTitle.textContent = data.title;
        viewContent.textContent = data.content;
        deletePassword.value = ""; // Passwortfeld leeren

        // Löschen nur mit Passwort 2009
        deleteBtn.onclick = () => {
          if(deletePassword.value === "2009"){
            remove(ref(db,"posts/"+key))
              .then(()=> viewPopup.classList.add("hidden"))
              .catch(err=>alert("Fehler beim Löschen: "+err));
          } else {
            alert("Falsches Löschen-Passwort");
          }
        };
      };

      cards.appendChild(div);
    });
  });

  closeView.onclick = () => viewPopup.classList.add("hidden");
}
