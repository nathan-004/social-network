var username = sessionStorage.getItem("username");
var globalContact = "";
var globalLastMessage = []; // sender, time, message

// Envoyer une demande de contact
document.getElementById("rightVerifyContact").addEventListener("submit", function(event) {
    event.preventDefault();

    var contact_username = document.getElementById("profile-username").value;
    
    fetch("http://127.0.0.1:5000/addcontactrequest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username,
            "contact_username": contact_username,
        })
    })
    .then(response => response.json()) // Convertir la réponse en json
    .then(data => {
        if (data.code != 0) {
            document.getElementById("addContactError").style.display = "initial";
            document.getElementById("addContactError").innerText = data.message;
        }
        else {
            document.getElementById("addContactError").style.display = "none";
        }
    })
    .catch(error => console.error(error));
});

document.getElementById("messageSender").addEventListener("submit", function(event) {
    event.preventDefault();

    var message = document.getElementById("message").value;
    
    if (globalContact == "") {
        return 0
    }

    fetch("http://127.0.0.1:5000/newmessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "sender": username,
            "contact": globalContact,
            "message": message,
        })
    })
    .then(response => response.json()) // Convertir la réponse en json
    .then(data => {
        if (data.code != 0) {
            console.error(data.message);
        }
        else {
            console.log(data.message);
        }
    })
    .catch(error => console.error(error));
});



function acceptContact(contactName) {
    fetch("http://127.0.0.1:5000/acceptcontactrequest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username,
            "request_username": contactName,
        })
    })
    .then(response => response.json()) // Convertir la réponse en json
    .then(data => {
        console.log(data.message);
    })
    .catch(error => console.error(error));
}

function addRequestContainer(profileName, profileImage="https://imgs.search.brave.com/GkAIuY4uQSRlbLRd1mseDZNRj6Bx_rQEz2b-y_8gaf8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzJmLzE1/L2YyLzJmMTVmMmU4/YzY4OGIzMTIwZDNk/MjY0NjdiMDYzMzBj/LmpwZw") {
    // Ajoute une div de demande de contact dans la barre droite

    // Créer la div principale
    let requestContainer = document.createElement("div");
    requestContainer.classList.add("right-request-container");

    // Ajouter l'image de profil
    let img = document.createElement("img");
    img.src = profileImage; // URL de l'image
    img.alt = `Image de profil de ${profileName}`;

    // Ajouter le nom du profil
    let p = document.createElement("p");
    p.textContent = profileName;

    // Créer la div des boutons
    let buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("right-contact-accept");

    // Bouton Accepter
    let acceptButton = document.createElement("button");
    acceptButton.textContent = "Accepter";
    acceptButton.addEventListener("click", () => {
        acceptContact(profileName);
    });

    // Bouton Refuser
    let refuseButton = document.createElement("button");
    refuseButton.textContent = "Refuser";
    refuseButton.addEventListener("click", () => {
        
    });

    // Ajouter les boutons dans la div
    buttonsDiv.appendChild(acceptButton);
    buttonsDiv.appendChild(refuseButton);

    // Ajouter tout dans la div principale
    requestContainer.appendChild(img);
    requestContainer.appendChild(p);
    requestContainer.appendChild(buttonsDiv);

    // Ajouter la div dans le conteneur parent
    document.querySelector(".accept-contact-container").appendChild(requestContainer);
}

function addContactContainer(profileName, profileImage="https://imgs.search.brave.com/GkAIuY4uQSRlbLRd1mseDZNRj6Bx_rQEz2b-y_8gaf8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzJmLzE1/L2YyLzJmMTVmMmU4/YzY4OGIzMTIwZDNk/MjY0NjdiMDYzMzBj/LmpwZw") {
    // Ajoute un lien vers un contact dans la barre gauche

    // Créer la div principale
    let contactContainer = document.createElement("a");
    contactContainer.classList.add("left-contact-link");
    contactContainer.href = "#";
    contactContainer.setAttribute("contact-username", profileName);

    // Ajouter l'image de profil
    let img = document.createElement("img");
    img.src = profileImage; // URL de l'image
    img.alt = `Image de profil de ${profileName}`;

    // Ajouter le nom du profil
    let p = document.createElement("p");
    p.textContent = profileName;

    contactContainer.appendChild(img);
    contactContainer.appendChild(p);

    // Ajouter la div dans le conteneur parent
    document.querySelector(".left-contacts-container").appendChild(contactContainer);

    contactContainer.addEventListener("click", function(event) { // Action si le contact est cliqué
        event.preventDefault();
        let username = event.currentTarget.getAttribute("contact-username");
        globalContact = username;
        initMessages();
    });
}

function addMessage(message) {
    // message -> [sender, time, message]

    let messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container")

    if (message[0] == username) {
        messageContainer.classList.add("right");
    }
    else {
        messageContainer.classList.add("left");
    }

    let p = document.createElement("p");
    p.textContent = message[2];

    messageContainer.appendChild(p);

    document.querySelector(".mid-messages-container").appendChild(messageContainer);
}


function setContactRequests() {
    // Actualise les demandes de contacts dans accept-contact-container
    fetch("http://127.0.0.1:5000/getcontactrequests", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username,
        })
    })
    .then(response => response.json()) // Convertir la réponse en json
    .then(data => {
        requests = data.data
        document.querySelector(".accept-contact-container").innerHTML = ""; // Efface le contenu de la div
        if (requests.length != 0) {
            for (i = 0, len = requests.length; i < len; i++) {
                console.log(len);
                addRequestContainer(requests[i]);
            }
        }
    })
    .catch(error => console.error(error));
}

function setContactsLeft() {
    // Actualise les contacts dans la barre de gauche
    fetch("http://127.0.0.1:5000/getcontacts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username,
        })
    })
    .then(response => response.json()) // Convertir la réponse en json
    .then(data => {
        contacts = data.data
        document.querySelector(".left-contacts-container").innerHTML = ""; // Efface le contenu de la div
        if (contacts.length != 0) {
            for (i = 0, len = contacts.length; i < len; i++) {
                addContactContainer(contacts[i]);
            }
        }
    })
    .catch(error => console.error(error));
}

function initMessages(contact=true) {
    // contact = true -> Afficher messages sinon les cacher

    document.getElementById("contactUsername").innerHTML = globalContact;

    if (contact) {
        document.querySelector(".mid-top-container").style.display = "flex";
        document.querySelector(".mid-messages-container").style.display = "initial";
        document.querySelector(".mid-message-sender").style.display = "initial";
    }
    else {
        document.querySelector(".mid-top-container").style.display = "none";
        document.querySelector(".mid-messages-container").style.display = "none";
        document.querySelector(".mid-message-sender").style.display = "none";
    }
}


async function setMessages() { // Fonctionnement asynchrone
    contact = globalContact;
    var stopLoop = false;

    for (let i = 0; i < 2; i++) {

        if (stopLoop) {
            break;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/getmessages", { // Attendre que la fonction ait fini avant de continuer
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "username": username,
                    "contact": contact,
                    "mode": i,
                })
            });

            const data = await response.json(); // Convertir la réponse en json
            messages = data.data;

            if (i == 0) { // Optimiser le nombre de message envoyés
                // message = last message
                if (JSON.stringify(messages) === JSON.stringify(globalLastMessage)) { // Eviter la comparaison de la position dans la mémoire
                    stopLoop = true;
                }
            }
            else {
                if (messages.length != 0) {
                    document.querySelector(".mid-messages-container").innerHTML = ""; // Efface le contenu de la div

                    for (let j = 0, len = messages.length; j < len; j++) {
                        addMessage(messages[j]);
                    }

                    globalLastMessage = messages[messages.length - 1];
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}

function main() {
    setContactRequests();
    setContactsLeft();
    if (globalContact != "") {
        setMessages();
    }
}

window.setInterval(main, 350);