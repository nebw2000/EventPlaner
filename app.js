// ===================== Firebase Initialisierung =====================
const firebaseConfig = {
  apiKey: "AIzaSyA77Epd0AXYz41c47nXuJHP2EKqWbuneb4",
  authDomain: "gyraevent.firebaseapp.com",
  databaseURL: "https://gyraevent-default-rtdb.firebaseio.com",
  projectId: "gyraevent",
  storageBucket: "gyraevent.firebasestorage.app",
  messagingSenderId: "1055376556998",
  appId: "1:1055376556998:web:cf91c05b247fcd8450a8c7"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

let editId = null;

// ===================== Login =====================
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("login").classList.add("hidden");
      document.getElementById("app").classList.remove("hidden");
      loadTheme();
      loadInventar();
      loadInfos();
    })
    .catch(err => {
      document.getElementById("loginError").innerText = err.message;
    });
}

// Automatisch prüfen, ob bereits angemeldet
auth.onAuthStateChanged(user => {
  if(user){
    document.getElementById("login").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    loadTheme();
    loadInventar();
    loadInfos();
  }
});

// ===================== Navigation =====================
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// ===================== Dark Mode =====================
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("dark", document.body.classList.contains("dark"));
}
function loadTheme() {
  if(localStorage.getItem("dark") === "true") document.body.classList.add("dark");
}

// ===================== Formular =====================
function openForm() { document.getElementById("form").classList.remove("hidden"); }
function closeForm() { 
  document.getElementById("form").classList.add("hidden");
  editId = null;
}

// ===================== Inventar =====================
function saveItem() {
  const nameVal = document.getElementById("name").value.trim();
  const anzahlVal = document.getElementById("anzahl").value;
  const gruppeVal = document.getElementById("gruppe").value;
  const statusVal = document.getElementById("status").value;

  if(!nameVal) return alert("Name darf nicht leer sein!");

  const data = { name: nameVal, anzahl: anzahlVal, gruppe: gruppeVal, status: statusVal };

  if(editId) {
    db.ref("inventar/" + editId).set(data);
  } else {
    db.ref("inventar").push(data);
  }
  closeForm();
}

function deleteItem(id) {
  if(confirm("Eintrag wirklich löschen?")) db.ref("inventar/" + id).remove();
}

function loadInventar() {
  const filter = document.getElementById("filterGroup").value;
  const query = document.getElementById("search").value.toLowerCase();
  const tbody = document.getElementById("inventarListe");
  tbody.innerHTML = "";

  db.ref("inventar").on("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const data = child.val();
      if(filter !== "alle" && data.gruppe !== filter) return;
      if(!data.name.toLowerCase().includes(query)) return;

      const tr = document.createElement("tr");
      tr.className = "status-" + (data.status.includes("✅") ? "Ok" : data.status.includes("❌") ? "Defekt" : "Leer");

      tr.innerHTML = `
        <td>${data.name}</td>
        <td>${data.anzahl}</td>
        <td>${data.gruppe}</td>
        <td>${data.status}</td>
        <td><button class="delete" onclick="deleteItem('${child.key}')">❌ Löschen</button></td>
      `;
      tr.onclick = () => editItem(child.key, data);
      tbody.appendChild(tr);
    });
    loadWichtig();
  });
}

function editItem(id, data) {
  editId = id;
  openForm();
  document.getElementById("name").value = data.name;
  document.getElementById("anzahl").value = data.anzahl;
  document.getElementById("gruppe").value = data.gruppe;
  document.getElementById("status").value = data.status;
}

function loadWichtig() {
  const ul = document.getElementById("wichtigListe");
  ul.innerHTML = "";
  db.ref("inventar").once("value").then(snapshot => {
    snapshot.forEach(child => {
      const data = child.val();
      if(!data.status.includes("✅")) {
        const li = document.createElement("li");
        li.textContent = `${data.name} (${data.status})`;
        ul.appendChild(li);
      }
    });
  });
}

// ===================== Aktuell =====================
function addInfo() {
  const text = document.getElementById("infoText").value.trim();
  if(!text) return;
  db.ref("infos").push({ text });
  document.getElementById("infoText").value = "";
}

function loadInfos() {
  const ul = document.getElementById("infoListe");
  db.ref("infos").on("value", snapshot => {
    ul.innerHTML = "";
    snapshot.forEach(child => {
      const li = document.createElement("li");
      li.textContent = child.val().text;
      ul.appendChild(li);
    });
  });
}
