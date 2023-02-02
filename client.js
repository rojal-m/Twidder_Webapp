

displayView = function() {
    // the code required to display a view
    const view = document.getElementById("view");
    let readToken = localStorage.getItem("token");
    if (readToken != null) {
        const profileView = document.getElementById("profileView");
        view.innerHTML = profileView.innerText;
    } else {
        const welcomeView = document.getElementById("welcomeView");
        view.innerHTML = welcomeView.innerText;
    }
};

window.onload = function() {
    // code that is expected as the page is loaded.
    // You shall put your own custom code here.
    // window.allert() is not allowed to be used in your implementation.
    displayView();
};

function login(formData){
    console.log(formData.loginEmail.value);
    console.log(formData.loginPassword.value);
    let email = formData.loginEmail.value;
    let password = formData.loginPassword.value;
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
            console.log(user);
            const res = serverstub.signUp(user);
            if (res.success) {
                usermessages.style.color = "green";
                usermessages.innerText = res.message;  
                usermessages.innerText += " Login to continue.";   
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
    if(error) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        return false;
    }
};
