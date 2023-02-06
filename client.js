

displayView = function() {
    // the code required to display a view
    const view = document.getElementById("view");
    let readToken = localStorage.getItem("token");
    const body = document.querySelector("body");
    if (readToken != null) {
        const profileView = document.getElementById("profileView");
        view.innerHTML = profileView.innerText;
        body.classList.add("bodyProfile")
        body.classList.remove("bodyWelcome")
        openTab("Home");
    } else {
        const welcomeView = document.getElementById("welcomeView");
        view.innerHTML = welcomeView.innerText;
        body.classList.add("bodyWelcome")
        body.classList.remove("bodyProfile")
    }
};

const tab = document.getElementsByClassName("tab");
let tabOpen = "";
function openTab(tabName) {
    for (let i = 0; i < tab.length; i++) {
        const block = document.getElementById(tab[i].innerText)
        if ( tab[i].innerText == tabName ) {
            tab[i].classList.add("active");
            block.style.display = 'block';
            if (tabName == 'Home') {
                //userInfo();
                //console.log(block.childNodes.item(1).childNodes.item(1));
                userInfo(block.childNodes.item(1).childNodes.item(1))
            } else if (tabName == 'Browse') {

            } else if (tabName == 'Account') {
                
            }
        } else{ 
            tab[i].classList.remove("active");
            block.style.display = 'none';
        }
    }
    /* console.log(tabName);
    console.log(tab[i].innerText); */
};

window.onload = function() {
    // code that is expected as the page is loaded.
    // You shall put your own custom code here.
    // window.allert() is not allowed to be used in your implementation.
    displayView();
};

function signIn(formData){
    let email = formData.signInEmail.value;
    let password = formData.signInPassword.value;
    const usermessages = document.getElementById("userMessages");
    usermessages.style.display = "block";
    if (String(password).length >= 6) {
        const res = serverstub.signIn(email, password);
        if (res.success) {
            usermessages.style.color = "green";
            usermessages.innerText = res.message;
            localStorage.setItem("token", res.data);
            displayView();
        } else {
            usermessages.style.color = "red";
            usermessages.innerText = res.message; 
        }
    } else {
        usermessages.style.color = "red";
        usermessages.innerText = "Passwords must be 6 characters or longer.";
    }
};
function passwordChange(formData){
    let oldPassword = formData.currPsw.value;
    let newPassword = formData.newPsw.value;
    let rePassword = formData.repassword.value;
    let readToken = localStorage.getItem("token");
    const usermessages = document.getElementById("userMessages");
    usermessages.style.display = "block";
    if ( readToken != null) {
        if (String(oldPassword).length >= 6 && String(newPassword).length >= 6 && String(rePassword).length >= 6) {
            if (newPassword === rePassword) {
                const res = serverstub.changePassword(readToken, oldPassword, newPassword);
                if (res.success) {
                    usermessages.style.color = "green";
                    usermessages.innerText = res.message; 
                    formData.currPsw.value = null;
                    formData.newPsw.value = null;
                    formData.repassword.value = null;
                } else {
                    usermessages.style.color = "red";
                    usermessages.innerText = res.message; 
                }
            } else {
                usermessages.style.color = "red";
                usermessages.innerText = "Passwords do not match.";
            }
        } else {
            usermessages.style.color = "red";
            usermessages.innerText = "Passwords must be 6 characters or longer.";
        }
    } else {
        usermessages.style.color = "red";
        usermessages.innerText = "User Not Signed In.";
    }
}
function signOut(){
    let readToken = localStorage.getItem("token");
    const usermessages = document.getElementById("userMessages");
    usermessages.style.display = "block";
    if ( readToken != null) {
        const res = serverstub.signOut(readToken);
        if (res.success) {
            localStorage.removeItem("token");
            usermessages.style.color = "green";
            usermessages.innerText = res.message;
            displayView();
        } else {
            usermessages.style.color = "red";
            usermessages.innerText = res.message; 
        }
    } else {
        usermessages.style.color = "red";
        usermessages.innerText = "User Not Signed In.";
    }
}

function signup(formData){
    let password = formData.signupPassword.value;
    let repassword = formData.repassword.value;
    const usermessages = document.getElementById("userMessages");
    usermessages.style.display = "block";
    if (password === repassword) {
        if (String(password).length >= 6) {
            let user = {
                email : formData.signupEmail.value,
                password : password,
                firstname: formData.fname.value,
                familyname: formData.lname.value,
                gender: formData.gender.value,
                city: formData.city.value,
                country: formData.country.value
            };
            //console.log(user);
            const res = serverstub.signUp(user);
            if (res.success) {
                usermessages.style.color = "green";
                usermessages.innerText = res.message;  
                usermessages.innerText += " Signin to continue.";   
            } else {
                usermessages.style.color = "red";
                usermessages.innerText = res.message; 
            }
        } else {
            usermessages.style.color = "red";
            usermessages.innerText = "Passwords must be 6 characters or longer.";
        }
    } else {
        usermessages.style.color = "red";
        usermessages.innerText = "Passwords do not match.";
    }
};

function userInfo(element) {
    //const element = document.getElementById("userInfo");
    //console.log(element);
    let readToken = localStorage.getItem("token");
    if ( readToken != null) {
        const res = serverstub.getUserDataByToken(readToken);
        if (res.success) {
            //console.log(res.data);
            for (const child of element.children) {
                if (child.id == 'name') {
                    child.innerText = res.data.firstname+" "+res.data.familyname;
                } else if (child.id == 'email') {
                    child.innerText = res.data.email;
                } else if (child.id == 'gender') {
                    child.innerText = res.data.gender;
                } else if (child.id == 'address') {
                    child.innerText = res.data.city+", "+res.data.country;
                }
              }
            /*element.innerHTML = "<H2 itemid='name'>"+res.data.firstname+" "+res.data.familyname+"</H2>\
                                <br>\
                                <h4>Email</h4>\
                                <p itemid='email'>"+res.data.email+"</p>\
                                <h4>Gender</h4>\
                                <p id='gender'>"+res.data.gender+"</p>\
                                <h4>Address</h4>\
                                <p id='adress'>"+res.data.city+", "+res.data.country+"</p>";*/
        } else {
            console.log(res.message); 
        }
    }  else {
        console.log("User Not Signed In.");
    }
}