import { db, app } from "../../../../firebase-config.js";
import {
    getAuth,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

import {
    collection,
    addDoc,
    Timestamp,
    query,
    where,
    onSnapshot,
    doc,
    deleteDoc,
    updateDoc,
    orderBy
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

// Message of work
let message = document.querySelector(".message-of-task")


// checking user is signing or not
const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
    let loader = document.getElementById("loader");
    let hide = document.getElementById("hide")
    if (user) {
        const uid = user.uid;
        loader.style.display = "block"
        fetchDataRealtime()
        setImage()
        hide.style.display = "none"
    } else {
        console.log("User is signed out")
        return false;
    }
});

// Adding data to firebase firestore
let todo = document.querySelector(".todo")
async function addTodo() {
    if (todo.value.length > 2) {
        addBtn.src = "images/add.gif"
        let collectionRef = collection(db, "Todos");
        await addDoc(collectionRef, {
            Todo: todo.value,
            uid: auth.currentUser.uid,
            dateExample: Timestamp.fromDate(new Date()),
            urgent: "Urgent",
        })
        todo.value = ""
        addBtn.src = "images/add.jpg"
    }
    else {
        alert("Please type first");
    }
}

// Logout feature and user will move signin page
let logout = document.querySelector(".logout");
logout.addEventListener("click", logOut)
async function logOut() {
    await signOut(auth).then(() => {
        location.replace("../../../../index.html")
    }).catch((error) => {
        console.log(error)
    });
}


let dpImage = document.querySelector("#dpImage");

async function setImage() {
    let dataRef = collection(db, "users");
    let condition = where("uid", "==", auth.currentUser.uid);
    const q = query(dataRef, condition);
    onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            dpImage.src = doc.data().dpURL
        })

    })
}


// Make listing of firebase data on a table 
let unsub;
let ul = document.querySelector(".main-list")
async function fetchDataRealtime() {
    let dataRef = collection(db, "Todos");
    let condition = where("uid", "==", auth.currentUser.uid);
    const q = query(dataRef, condition);
    unsub = onSnapshot(q, (querySnapshot) => {
        ul.innerHTML = ""
        if (querySnapshot.size > 0) {
            message.innerHTML = "";
            message.style.padding = "0px"
            querySnapshot.forEach((doc) => {
                getId = doc.id
                ul.innerHTML += `<li>
                    <span class="text">
                       ${doc.data().Todo}
                    </span>
                    <span class="buttons">
                        <button type="button" id="editBtn" class="btn btn-primary"onclick="editTodo('${doc.id}','${doc.data().Todo}')">Edit</button>
                        <button id="delete" class="btn btn-danger" onclick="deleteTodo('${doc.id}')">Delete</button>
                    </span>
                    </li>
                    <table>
                        <tr>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                        <tr>
                            <td>${doc.data().dateExample.toDate()}</td>
                            <td>${doc.data().urgent}</td>
                        </tr>
                    </table>`
            });
        }
        else {
            message.innerHTML = `<div class="container">
        <div class="row">
            <div class="col text-center">
                <h3>Hurray You Don't have any work to do now</h3>
            </div>
        </div>
    </div>`
            message.style.padding = "10px 5px"
        }

    })
}

// Delete todo feature
const deleteTodo = async (id) => {
    let deleteRef = doc(db, "Todos", id)
    await deleteDoc(deleteRef);
};


// Edit Todo Feature
let getId;
let addBtn = document.getElementById("add");
const editTodo = async (id, val) => {
    getId = id;
    todo.value = val
    addBtn.setAttribute("src", "images/save.png")
    addBtn.setAttribute("onclick", `saveTodo()`);
}


// save todo feature
const saveTodo = async () => {
    const docRef = doc(db, "Todos", getId);
    await updateDoc(docRef, {
        Todo: todo.value,
        dateExample: Timestamp.fromDate(new Date()),
        urgent: "Urgent"
    });
    todo.value = "";
    addBtn.setAttribute("src", "images/add.jpg")
    addBtn.setAttribute("onclick", `addTodo()`);
    getId = undefined;
}

// You have to define function by this method because in type module onclick function will not work
window.deleteTodo = deleteTodo;
window.editTodo = editTodo;
window.saveTodo = saveTodo;
window.addTodo = addTodo;