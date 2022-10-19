
import { app, db, storage } from "./../firebase-config.js"
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { uploadBytes, getDownloadURL,ref } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js"
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
    } else {
        // 
    }
});

let submit = document.getElementById(`submit-data`);
submit.addEventListener(`click`, submitData);

async function submitData() {

    let correct = 0;
    // Error para show
    let nameError = document.querySelector("#name-error");
    let error1 = document.querySelector("#fir-error");
    let error2 = document.querySelector("#sec-error");
    let error3 = document.querySelector("#thi-error");
    let error4 = document.querySelector("#four-error");
    let error5 = document.querySelector("#five-error");
    let fillAllFields = document.querySelector(".fill")
    fillAllFields.classList.add("error")

    // Input Fields
    let nameEl = document.querySelector(".nameElement").value;
    let firstEL = document.querySelector(".element-1").value;
    let secondEL = document.querySelector(".element-2").value;
    let thirdEL = document.querySelector(".element-3").value;
    let fourEL = document.querySelector(".element-4").value;
    let fifthEL = document.querySelector(".element-5");


    // Regex
    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    let numberRegex = /^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/gm;

    // Name Checker
    if (nameEl !== "") {
        if (nameEl.length > 2) {
            correct++
        } else {
            nameError.innerHTML = "Please enter a valid Name";
            clearAllError()
            return false
        }

    } else {
        fillAllFields.innerHTML = "ALL INPUT FIELDS ARE REQUIRED"
        clearAllError()
        return false
    }

    // Email Checker
    if (firstEL !== "") {
        if (emailRegex.test(firstEL)) {
            correct++
        } else {
            error1.innerHTML = "Please enter a valid email"
            clearAllError()
            return false
        }

    } else {
        fillAllFields.innerHTML = "ALL INPUT FIELDS ARE REQUIRED"
        clearAllError()
        return false
    }


    // Password Checker
    if (secondEL !== "") {
        if (secondEL.length > 7) {
            correct++
        } else {
            error2.innerHTML = "Password contain minimum 8 characters"
            clearAllError()
            return false
        }

    } else {
        fillAllFields.innerHTML = "ALL INPUT FIELDS ARE REQUIRED"
        clearAllError()
        return false;
    }

    // Confirm Password Checker
    if (thirdEL !== ``) {
        if (thirdEL === secondEL) {
            correct++
        } else {
            error3.innerHTML = "Please Enter a matched password"
            clearAllError()
            return false
        }
    }
    else {
        fillAllFields.innerHTML = "ALL INPUT FIELDS ARE REQUIRED"
        clearAllError()
        return false
    }

    // Number Checker
    if (fourEL !== ``) {
        if (numberRegex.test(fourEL)) {
            correct++
        } else {
            error4.innerHTML = "Please Enter a valid Number"
            clearAllError()
            return false
        }
    }
    else {
        fillAllFields.innerHTML = "ALL INPUT FIELDS ARE REQUIRED"
        clearAllError()
        return false
    }

    // Picture Checker
    if (fifthEL !== ``) {
        correct++
    }
    else {
        fillAllFields.innerHTML = "ALL INPUT FIELDS ARE REQUIRED"
        clearAllError()
        return false
    }


    //Converting submit Button
    let submit = document.getElementById("submit-data")
    // Set Data in Firebase
    if (correct === 6) {
        submit.innerHTML = `<img src="Forget Password/Email Verification/Todos/images/add.gif" alt="loader" id="loader">`
        let file = fifthEL.files[0]
        let imageRef = ref(storage, `images/${file.name}`);
        try {
            let uploaded = await uploadBytes(imageRef, file);
            let url = await getDownloadURL(imageRef);
            let { user } = await createUserWithEmailAndPassword(auth, firstEL, secondEL)
            let userRef = doc(db, "users", user.uid)
            let data = await setDoc(userRef, {
                userName: nameEl,
                email: firstEL,
                PhoneNumber: fourEL,
                uid: auth.currentUser.uid,
                dpURL : url
            })
            console.log(url, 'downloadable URL');
            verifyEmail()
            location = "Forget Password/Email Verification/verification.html"
            submit.innerHTML = "Submit"
            clearInputFields()
        }
        catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
            if (errorMessage === `Firebase: Error (auth/email-already-in-use).`) {
                fillAllFields.innerHTML = `Already have an account`;
                clearAllError()
            }
        }
    }
}





// For Clear InputFields
function clearInputFields() {
    let nameElClear = document.querySelector(".nameElement").value = "";
    let firstElClear = document.querySelector(".element-1").value = "";
    let secondElClear = document.querySelector(".element-2").value = "";
    let thirdElClear = document.querySelector(".element-3").value = "";
    let fourELClear = document.querySelector(".element-4").value = "";
    let fifthELClear = document.querySelector(".element-5").value = "";
}

// For Clear All Error
function clearError() {
    let nameErrorClear = document.querySelector("#name-error").innerHTML = "";
    let error1Clear = document.querySelector("#fir-error").innerHTML = "";
    let error2Clear = document.querySelector("#sec-error").innerHTML = "";
    let error3Clear = document.querySelector("#thi-error").innerHTML = "";
    let error4Clear = document.querySelector("#four-error").innerHTML = "";
    let error5Clear = document.querySelector("#five-error").innerHTML = "";
    let allNoneInput = document.querySelector(".fill").innerHTML = "";
}
let stopSetTime;
function clearAllError() {
    stopSetTime = setTimeout(clearError, 3500)
}


export async function verifyEmail() {
    try {
        let data = await sendEmailVerification(auth.currentUser)
    } catch (e) {
        console.log(e)
    }
}