import { app } from "./firebase-config.js"
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

const auth = getAuth(app);


// Checker of user
onAuthStateChanged(auth, (user) => {
    if (user) {
      if(user.emailVerified === true){
        location.replace("signup/Forget Password/Email Verification/Todos/todo.html")
      }

    }
    if(user.emailVerified === false){
        location = "signup/Forget Password/Email Verification/verification.html"
    }
  });


// Create New Account
let noAccount = document.getElementById(`new-account`);
noAccount.addEventListener(`click`, newAccountPage);
function newAccountPage() {
    location = `signup/signup.html`
}

// Forgot Password
let forget = document.getElementById("forget");
forget.addEventListener("click", forgotPassword);
function forgotPassword() {
    location = "signup/Forget Password/forget.html";
}

// Login
let login = document.getElementById("login")
login.addEventListener("click", loginUser)

async function loginUser() {

    // All Errors
    var loginError1 = document.querySelector(".loginError-1");
    loginError1.classList.add("error")
    var loginError2 = document.querySelector(".loginError-2");
    loginError2.classList.add("error")
    let mainError = document.querySelector(".main-error")
    mainError.classList.add("error")
    let fillAllFields = document.querySelector(".fill")
    fillAllFields.classList.add("error")

    // Input Elements
    var checkEmail = document.querySelector(".loginEmailEl1").value;
    var checkPassword = document.querySelector(".loginEmailEl2").value;

    // check all input fields are not empty
    if (checkEmail !== "" || checkPassword !== "") {
        try {
            let user = await signInWithEmailAndPassword(auth, checkEmail, checkPassword)
            location = `signup/Forget Password/Email Verification/Todos/todo.html`
        }
        catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
            if (errorMessage === `Firebase: Error (auth/user-not-found).`) {
                mainError.innerHTML = "You don't have any account"
            } else if (errorMessage === `Firebase: Error (auth/wrong-password).`) {
                mainError.innerHTML = `Wrong Password`
            }
        }

    }
    clearErrorAfter3Sec()

}

// Clear All input fields after showing one error process start here
function clearInputFields() {
    let clearEl1 = document.querySelector(".loginEmailEl1").value = "";
    let clearEl2 = document.querySelector(".loginEmailEl2").value = "";
}

// Clear error after 3 seconds when it is shown process start here
function clearError() {
    let loginError1 = document.querySelector(".loginError-1").innerHTML = "";
    let loginError2 = document.querySelector(".loginError-2").innerHTML = "";
    let ClearMainError = document.querySelector(".main-error").innerHTML = "";
    let allNoneInput = document.querySelector(".fill").innerHTML = "";
}

var stopSetTime;
function clearErrorAfter3Sec() {
    stopSetTime = setTimeout(clearError, 3000)
}