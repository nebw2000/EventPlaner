// FIREBASE INITIALISIERUNG
firebase.initializeApp({
  apiKey: "AIzaSyA77Epd0AXYz41c47nXuJHP2EKqWbuneb4",
  authDomain: "gyraevent.firebaseapp.com",
  databaseURL: "https://gyraevent-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gyraevent",
  storageBucket: "gyraevent.firebasestorage.app",
  messagingSenderId: "1055376556998",
  appId: "1:1055376556998:web:cf91c05b247fcd8450a8c7"
});

const auth = firebase.auth();
const db = firebase.database();
const auth = firebase.auth();
const db = firebase.database();

let editId = null;

// LOGIN
document.getElementById("loginBtn").onclick = () => {
  const u = email.value;
  const p = password.value;

  // Fallback Login
  if(u === "1" && p === "1") {
    enterApp();
    return;
  }

  auth.signInWithEmailAndPassword(u, p)
    .then(enterApp)
    .catch(showError);
};

function showError() {
  const pop = document.getElementById("popup");
  pop.classList.remove("hidden");
  setTimeout(()=>pop.classList.add("hidden"),3000);
}

function enterApp() {
  login.classList.add("hidden");
  app.classList.remove("hidden");
  showPage("home");
  startClock();
  loadInventar();
}

// NAV
function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// UHR
function startClock(){
  setInterval(()=>{
    const d=new Date();
    clock.innerText=d.toLocaleTimeString();
    date.innerText=d.toLocaleDateString();
    tvClock.innerText=d.toLocaleTimeString();
  },1000);
}

// INVENTAR
function openForm(){ form.classList.remove("hidden"); }
function closeForm(){ form.classList.add("hidden"); editId=null; }

function saveItem(){
  const data={
    name:iname.value,
    anzahl:ianzahl.value,
    gruppe:igruppe.value
  };
  if(editId) db.ref("inventar/"+editId).set(data);
  else db.ref("inventar").push(data);
  closeForm();
}

function loadInventar(){
  const q = search.value?.toLowerCase() || "";
  inventarListe.innerHTML="";
  db.ref("inventar").on("value",snap=>{
    inventarListe.innerHTML="";
    snap.forEach(c=>{
      if(!c.val().name.toLowerCase().includes(q)) return;
      inventarListe.innerHTML += `
        <tr>
          <td>${c.val().name}</td>
          <td>${c.val().anzahl}</td>
          <td>${c.val().gruppe}</td>
          <td><button onclick="edit('${c.key}')">Edit</button></td>
        </tr>`;
    });
  });
}

function edit(id){
  db.ref("inventar/"+id).once("value").then(s=>{
    editId=id;
    iname.value=s.val().name;
    ianzahl.value=s.val().anzahl;
    igruppe.value=s.val().gruppe;
    openForm();
  });
}
