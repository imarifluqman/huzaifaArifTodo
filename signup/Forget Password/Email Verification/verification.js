import {app} from "../../../firebase-config.js";
import { getAuth , sendEmailVerification , onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
const auth = getAuth(app);

let resendEmail = document.getElementById(`submit-data`);
resendEmail.addEventListener(`click`,resend);

function resend(){
    sendEmailVerification(auth.currentUser)
}

let verify = document.getElementById("verify");
verify.addEventListener("click",checkVerification);
let notVerify = document.querySelector(".verify-email")

let getUser;
function checkVerification(){
    onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          getUser = user
          location.reload()
        }
         else {
          console.log("User is signed out")
        }
        changedPage()
      });
}
function changedPage(){
    if(getUser.emailVerified === true){
        location.replace ("Todos/todo.html")
    }
    else{
        notVerify.innerHTML = "Please check your email and confirmed";
        removeError();
    }
}

const clear = () => {
    notVerify.innerHTML = ``;
}
function removeError(){
    setTimeout(clear,3500)
}