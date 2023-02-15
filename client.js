var con = {};
var user = {};
var friend = {};

window.onload = function() {
    con.body = document.querySelector("body");
    con.view = document.getElementById("view");
    con.profileView = document.getElementById("profileView");
    con.welcomeView = document.getElementById("welcomeView");
    // code that is expected as the page is loaded.
    displayView();
};

displayView = function() {
    // the code required to display a view
    let readToken = localStorage.getItem("token");
    if (readToken != null) {
        con.view.innerHTML = con.profileView.innerText;
        con.body.classList.add("bodyProfile")
        con.body.classList.remove("bodyWelcome")
        con.nav = document.getElementsByClassName("nav");
        con.tabs = document.getElementsByClassName("tabs");  
        con.info = document.getElementsByClassName("userInfo");  
        con.feed = document.getElementsByClassName("feedbody");
        con.fCont = document.getElementById("friendContainer");
        con.ffeedCont = document.getElementById("friendFeedContainer"); 
        openTab();
        userInfo('user');
    } else {
        con.view.innerHTML = con.welcomeView.innerText;
        con.body.classList.add("bodyWelcome")
        con.body.classList.remove("bodyProfile")
    }
};

function openTab(currTab) {
    hideMessage();
    if (currTab != null) {
        localStorage.setItem("currTab", currTab);
    } else {
        currTab = localStorage.getItem("currTab");
        if (currTab == null || (currTab != 'Home' && currTab && 'Browse' && currTab != 'Account')) {
            currTab = 'Home'
            localStorage.setItem("currTab", currTab);
        }
    }
    for (let i = 0; i < con.nav.length; i++) {
        if ( con.nav[i].innerText == currTab ) {
            con.nav[i].classList.add("active");
        } else{ 
            con.nav[i].classList.remove("active");
        }
    }
    for (let i = 0; i < con.tabs.length; i++) {
        if ( con.tabs[i].id == currTab ) {
            con.tabs[i].style.display = 'block';
        } else{ 
            con.tabs[i].style.display = 'none';
        }
    }
};

function userInfo(condition,email) {
    let readToken = localStorage.getItem("token");
    if ( readToken != null) {
        var res;
        if (condition == 'user') {
            res = serverstub.getUserDataByToken(readToken);
        } else if (condition == 'friend' && email != null) {
            res = serverstub.getUserDataByEmail(readToken,email);
        } 
        if (res != null) {
            if (res.success) {
                if (condition == 'user') {
                    user = res.data;
                    enterinfo(con.info[0], user);
                    displayFeed('user');
                } else if (condition == 'friend') {
                    friend = res.data;
                    enterinfo(con.info[1], friend);
                    displayFeed('friend');
                    con.fCont.style.display = "flex";
                    con.ffeedCont.style.display = "block";
                } 
            } else {
                message(res.message); 
            }
        } else {
            message('Friend Not Given');
        }
    }  else {
        message("User Not Signed In.");
    }
}
function enterinfo(element, data) {
    for (const child of element.children) {
        if (child.id == 'name') {
            child.innerText = data.firstname+" "+data.familyname;
        } else if (child.id == 'email') {
            child.innerText = data.email;
        } else if (child.id == 'gender') {
            child.innerText = data.gender;
        } else if (child.id == 'address') {
            child.innerText = data.city+", "+data.country;
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
}
function searchUser(formdata){
    const email = formdata.friendEmail.value;
    userInfo('friend',email);
}
function displayFeed(condition){
    let readToken = localStorage.getItem("token");
    if ( readToken != null) {
        var res;
        if (condition == 'user') {
            con.feed[0].innerHTML = "";
            res = serverstub.getUserMessagesByToken(readToken);
        } else if (condition == 'friend') {
            con.feed[1].innerHTML = "";
            res = serverstub.getUserMessagesByEmail(readToken,friend.email);
        }
        if (res.success) {
            if (condition == 'user') {
                enterfeed(con.feed[0], res.data);
            } else if (condition == 'friend') {
                enterfeed(con.feed[1], res.data);
            }
        } else {
            message(res.message); 
        }
    } else {
        message("User Not Signed In.");
    }
}
function enterfeed(element, feedArr, sort = true) {
    feedArr.forEach(data => {
        box = "<div class='feedbox'>\
                <h4>"+data.writer+"</h4>\
                <p>"+data.content+"</p>\
                </div>";
        if (sort) {
            element.innerHTML += box;
        } else {
            element.innerHTML = box + element.innerHTML;
        }
    });
}


function postMessage(formdata,condition) {
    const message = formdata.value;
    let readToken = localStorage.getItem("token");
    if ( readToken != null) {
        var res;
        if (condition == 'user') {
            res = serverstub.postMessage(readToken,message);
        } else if (condition == 'friend' && friend.email != null) {
            res = serverstub.postMessage(readToken,message,friend.email);
        } 
        if (res != null) {
            if (res.success) {
                const data = [{"writer":user.email,"content":message}];
                if (condition == 'user') {
                    enterfeed(con.feed[0], data, false);
                } else if (condition == 'friend') {
                    enterfeed(con.feed[1], data, false);
                }
            } else {
                message(res.message); 
            }
        } else {
            message('Friend Not Given.');
        }
    }  else {
        message("User Not Signed In.");
    }
}

//--------------------------------------------------------------------------------------
function passwordChange(formData){
    let oldPassword = formData.currPsw.value;
    let newPassword = formData.newPsw.value;
    let rePassword = formData.repassword.value;
    let readToken = localStorage.getItem("token");
    if ( readToken != null) {
        if (newPassword === rePassword) {
            const res = serverstub.changePassword(readToken, oldPassword, newPassword);
            if (res.success) {
                message(res.message,'good'); 
                clearForm(formData);
            } else {
                message(res.message); 
            }
        } else {
            message("Passwords do not match.");
        }
    } else {
        message("User Not Signed In.");
    }
}
function signOut(){
    let readToken = localStorage.getItem("token");
    if ( readToken != null) {
        const res = serverstub.signOut(readToken);
        if (res.success) {
            localStorage.removeItem("token");
            localStorage.removeItem("currTab");
            displayView();
        } else {
            message(res.message); 
        }
    } else {
        message("User Not Signed In.");
    }
}
function signIn(formData){
    let email = formData.signInEmail.value.toLowerCase();
    let password = formData.signInPassword.value;
    const res = serverstub.signIn(email, password);
    if (res.success) {
        localStorage.setItem("token", res.data);
        displayView();
    } else {
        message(res.message); 
    }
};

function signup(formData){
    let password = formData.signupPassword.value;
    let repassword = formData.repassword.value;
    let user = {
        email : formData.signupEmail.value.toLowerCase(),
        password : password,
        firstname: formData.fname.value,
        familyname: formData.lname.value,
        gender: formData.gender.value,
        city: formData.city.value,
        country: formData.country.value
    };
    if (password === repassword) {
        const res = serverstub.signUp(user);
        if (res.success) {
            message(res.message + " Signin to continue.",'good');
            clearForm(formData); 
        } else {
            message(res.message); 
        }
    } else {
        message("Passwords do not match.");
    }
};

function clearForm(formData) {
    /*formData.forEach(member => {
        member.value = null;
    });*/
    Object.keys(formData).forEach(function (key) {
        var val = formData[key];
        val.value = null;
    });
}

function message(message, condition = 'bad'){
    const usermessages = document.getElementById("userMessages");
    usermessages.style.display = "block";
    if (condition == 'good') {
        usermessages.style.color = "#005800"; //green
    } else {
        usermessages.style.color = "#610000"; //red
    }
    usermessages.innerText = message;
}

function hideMessage(){
    const usermessages = document.getElementById("userMessages");
    usermessages.style.display = "none";
}