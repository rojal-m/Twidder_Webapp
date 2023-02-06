const tab = document.getElementsByClassName("tab");
let tabOpen = "";
function openTab(tabName) {
    for (let i = 0; i < tab.length; i++) {
        const block = document.getElementById(tab[i].innerText)
        if ( tab[i].innerText == tabName ) {
            tab[i].classList.add("active");
            block.style.display = 'block';
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