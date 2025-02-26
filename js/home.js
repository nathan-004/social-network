var username = sessionStorage.getItem("username");

// Envoyer une demande de contact
document.getElementById("rightVerifyContact").addEventListener("submit", function(event) {
    event.preventDefault();

    var contact_username = document.getElementById("profile-username").value;
    console.log("test");
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
        alert(`${profileName} accepté !`);
    });

    // Bouton Refuser
    let refuseButton = document.createElement("button");
    refuseButton.textContent = "Refuser";
    refuseButton.addEventListener("click", () => {
        alert(`${profileName} refusé !`);
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
        if (requests.length != 0) {
            document.querySelector(".accept-contact-container").innerHTML = ""; // Efface le contenu de la div
            
            for (i = 0, len = requests.length; i < len; i++) {
                addRequestContainer(requests[i]);
            }
        }
    })
    .catch(error => console.error(error));
}

function main() {
    setContactRequests();
}

window.setInterval(main, 500);