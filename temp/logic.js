
function storeContact(formData){
    let name = formData.name.value;
    let number = formData.number.value;

    let readContacts = localStorage.getItem("contacts");
    let contacts = null;
    if (readContacts == null){
        contacts = new Array();
    }else{
        contacts = JSON.parse(localStorage.getItem("contacts"));
    }
    let contact = {
        cname : name,
        cnumber : number
    };

    contacts.push(contact);
    let contactsString = JSON.stringify(contacts);
    localStorage.setItem("contacts", contactsString);
}

function searchContact(formData){
    let name = formData.name.value;
    let readContacts = localStorage.getItem("contacts");
    if (readContacts != null){
        let contacts = JSON.parse(readContacts);
        contacts.forEach(function(contact){
            if (contact.cname == formData.name.value)
                document.getElementById("searchlist").innerHTML += "<li>" + contact.cname + " " + contact.cnumber + "</li>"
        });
    }else{
        document.getElementById("usermessages").innerText = "No contacts available!";
    }
}
