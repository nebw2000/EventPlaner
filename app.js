const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "gyraevent.firebaseapp.com",
  databaseURL: "https://gyraevent-default-rtdb.firebaseio.com",
  projectId: "gyraevent",
  storageBucket: "gyraevent.firebasestorage.app",
  messagingSenderId: "1055376556998",
  appId: "1:1055376556998:web:cf91c05b247fcd8450a8c7"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let editId = null;

function login() {
  const pw = document.getElementById("password").value;
  if (pw === "GyraTechnik") {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    loadInventar();
    loadInfos();
  }
}

function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function openForm() {
  document.getElementById("form").classList.remove("hidden");
}

function closeForm() {
  document.getElementById("form").classList.add("hidden");
  editId = null;
}

function saveItem() {
  const item = {
    name: name.value,
    anzahl: anzahl.value,
    gruppe: gruppe.value,
    status: status.value
  };

  if (editId) {
    db.ref("inventar/" + editId).set(item);
  } else {
    db.ref("inventar").push(item);
  }

  closeForm();
}

function loadInventar() {
  const filter = filterGroup.value;
  const list = document.getElementById("inventarListe");
  list.innerHTML = "";

  db.ref("inventar").on("value", snap => {
    list.innerHTML = "";
    snap.forEach(child => {
      const d = child.val();
      if (filter !== "alle" && d.gruppe !== filter) return;

      const tr = document.createElement("tr");
      tr.className = "status-" + d.status;
      tr.innerHTML = `
        <td>${d.name}</td>
        <td>${d.anzahl}</td>
        <td>${d.gruppe}</td>
        <td>${d.status}</td>
      `;
      tr.onclick = () => editItem(child.key, d);
      list.appendChild(tr);
    });

    loadWichtig();
  });
}

function editItem(id, d) {
  editId = id;
  openForm();
  name.value = d.name;
  anzahl.value = d.anzahl;
  gruppe.value = d.gruppe;
  status.value = d.status;
}

function loadWichtig() {
  const ul = document.getElementById("wichtigListe");
  ul.innerHTML = "";

  db.ref("inventar").once("value", snap => {
    snap.forEach(c => {
      const d = c.val();
      if (d.status !== "Ok") {
        const li = document.createElement("li");
        li.textContent = d.name + " (" + d.status + ")";
        ul.appendChild(li);
      }
    });
  });
}

function addInfo() {
  db.ref("infos").push({ text: infoText.value });
  infoText.value = "";
}

function loadInfos() {
  const ul = document.getElementById("infoListe");
  db.ref("infos").on("value", snap => {
    ul.innerHTML = "";
    snap.forEach(c => {
      const li = document.createElement("li");
      li.textContent = c.val().text;
      ul.appendChild(li);
    });
  });
}
