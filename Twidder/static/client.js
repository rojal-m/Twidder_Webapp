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
        sessionSetUp(readToken);
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
        if (currTab == null || (currTab != 'Home' && currTab != 'Browse' && currTab != 'Account')) {
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

sessionSetUp = function(token){
    console.log(window.location.hostname);
    console.log(window.location.port);
    let ws = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/echo`);
    console.log(ws);
    
    ws.onopen = function(){
        console.log(token);
        console.log("here");
        ws.send(token);
    };
 
    ws.onmessage = function (message){
        console.log(message);
        if(message.data == "sign_out") {
            signOut();
        }
 
    };
    ws.onerror = function (){
        console.log("sign out here for safety");
    };
 

}



function userInfo(condition,email) {
    let readToken = localStorage.getItem("token");
    if ( readToken != null) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if(this.status == 200) {
                    var res = JSON.parse(this.responseText);
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
                    message(this.status +": "+this.statusText); 
                }
            }
        };

        if (condition == 'user') {
            //res = getUserDataByToken(readToken);
            xhttp.open("GET", "/token/get_data", true);
        } else if (condition == 'friend' && email != null) {
            //res = getUserDataByEmail(readToken,email);
            xhttp.open("GET", "/email/get_data/"+email, true);
        } else {
            message('Friend Not Given');
        }
        xhttp.setRequestHeader("auth",readToken)
        xhttp.send();
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
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if(this.status == 200) {
                    var res = JSON.parse(this.responseText);
                    if (condition == 'user') {
                        enterfeed(con.feed[0], res.data);
                    } else if (condition == 'friend') {
                        enterfeed(con.feed[1], res.data);
                    }
                } else {
                    message(this.status +": "+this.statusText); 
                }
            }
        };

        if (condition == 'user') {
            con.feed[0].innerHTML = "";
            xhttp.open("GET", "/token/get_message", true);
        } else if (condition == 'friend') {
            con.feed[1].innerHTML = "";
            xhttp.open("GET", "/email/get_message/"+friend.email, true);
        }
        xhttp.setRequestHeader("auth",readToken)
        xhttp.send();
    } else {
        message("User Not Signed In.");
    }
}
function enterfeed(element, feedArr, sort = true) {
    feedArr.forEach(data => {
        box = "<div draggable='true' ondragstart='drag(event)' class='feedbox'>\
                <h4>"+data.writer+"</h4>\
                <p id='content'>"+data.content+"</p>\
                </div>";
        if (sort) {
            element.innerHTML += box;
        } else {
            element.innerHTML = box + element.innerHTML;
        }
    });
}
function drag(ev) {
    let data = ""
    for (const child of ev.target.children) {
        if (child.id == 'content') {
            data = child.innerText;
        }
    }
    ev.dataTransfer.setData("text", data);
}
function allowDrop(ev) {
    ev.preventDefault();
}
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.value = data;
}


function postMessage(formdata,condition) {
    const message = formdata.value;
    let readToken = localStorage.getItem("token");
    if ( readToken != null) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if(this.status == 201) {
                    const data = [{"writer":user.email,"content":message}];
                    if (condition == 'user') {
                        enterfeed(con.feed[0], data, false);
                    } else if (condition == 'friend') {
                        enterfeed(con.feed[1], data, false);
                    }
                    formdata.value = "";
                } else {
                    message(this.status +": "+this.statusText); 
                }
            }
        };
        xhttp.open("POST", "/token/post_message", true);
        xhttp.setRequestHeader("auth",readToken)
        xhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8")
        

        if (condition == 'user') {
            let messages = {message: message};
            xhttp.send(JSON.stringify(messages));
        } else if (condition == 'friend' && friend.email != null) {
            let messages = {email: friend.email, message: message};
            xhttp.send(JSON.stringify(messages));
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
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if(this.status == 200) {
                        message(res.message,'good'); 
                        clearForm(formData);
                    } else {
                        message(this.status +": "+this.statusText); 
                    }
                }
            };
            xhttp.open("PUT", "/token/change_password", true);
            xhttp.setRequestHeader("auth",readToken)
            xhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8")
            let passwords = {oldPassword: oldPassword, newPassword: newPassword};
            xhttp.send(JSON.stringify(passwords));
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
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if(this.status == 200) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("currTab");
                    displayView();
                } else {
                    message(this.status +": "+this.statusText); 
                }
            }
        };
        xhttp.open("POST", "/token/sign_out", true);
        xhttp.setRequestHeader("auth",readToken)
        xhttp.send();
    } else {
        message("User Not Signed In.");
    }
}
function signIn(formData){
    let email = formData.signInEmail.value.toLowerCase();
    let password = formData.signInPassword.value;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if(this.status == 201) {
                console.log(this.responseText);
                
                var res = JSON.parse(this.responseText);
                localStorage.setItem("token", res.data);
                displayView();
            } else {
                message(this.status +": "+this.statusText); 
            }
        }
    };
    xhttp.open("POST", "/sign_in", true);
    xhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8")
    let user = {email: email, password: password};
    xhttp.send(JSON.stringify(user));
};

function signup(formData){
    let password = formData.signupPassword.value;
    let repassword = formData.repassword.value;
    if (password === repassword) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if(this.status == 201) {
                    console.log(this.responseText);
                    
                    message(this.statusText + " Signin to continue.",'good');
                    clearForm(formData);
                } else {
                    message(this.status +": "+this.statusText); 
                }
            }
        };
        xhttp.open("POST", "sign_up", true);
        xhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8")
        let user = {
            email : formData.signupEmail.value.toLowerCase(),
            password : password,
            firstname: formData.fname.value,
            familyname: formData.lname.value,
            gender: formData.gender.value,
            city: formData.city.value,
            country: formData.country.value
        };
        xhttp.send(JSON.stringify(user));
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
        if (val.type == "submit") {
            return;
        } else if ( val.id == "gender") {
            val.options[0].selected = 'selected';
            return;
        }
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