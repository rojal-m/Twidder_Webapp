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
}

window.onload = function() {
    // code that is expected as the page is loaded.
    // You shall put your own custom code here.
    // window.allert() is not allowed to be used in your implementation.
    openTab("Home")
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