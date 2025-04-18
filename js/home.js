var username = sessionStorage.getItem("username");

var globalTheme = "default";
var globalContact = "";
var globalLastMessage = []; // sender, time, message
var globalContacts = [];

var mouseCheck = false;
var clickCheck = false;

var themesElements = {
    "sidePanels": ["left-container", "right-container", "html-footer", "html-header"],
    "midMessage": ["mid-messages-container"],
    "messageLeft": ["left-p"],
    "messageRight": ["right-p"],
    "mid": ["mid-container"]
}
var themes = ["default", "dark", "contrast", "blue", "personnalisable"];

var pthemesElements = {
    "element-selection-container": [], // Contient les éléments choisis par l'utilisateur
    "element-color-selection-container": [],
}
var pthemes = ["element-selection-container", "element-color-selection-container"]

var pthemesChoices = {} // Sous forme élément : {selector : couleur}

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
		document.getElementById("message").value = "";
    })
    .catch(error => console.error(error));
});

document.getElementById("closeContactButton").addEventListener("click", function (event) {
    document.querySelector(".left-container").style.display = "none";
    document.getElementById("openLeftContainer").style.display = "initial";
});

document.getElementById("openLeftContainer").addEventListener("click", function (event) {
    document.querySelector(".left-container").style.display = "flex";
    document.getElementById("openLeftContainer").style.display = "none";
});

document.getElementById("closeContactButtonRight").addEventListener("click", function (event) {
    document.querySelector(".right-container").style.display = "none";
    document.getElementById("openRightContainer").style.display = "initial";
});

document.getElementById("openRightContainer").addEventListener("click", function (event) {
    document.querySelector(".right-container").style.display = "flex";
    document.getElementById("openRightContainer").style.display = "none";
});

document.getElementById("colorButton").addEventListener("click", function (event) {
	document.getElementById("colorSettings").style.display = "initial";
});

document.getElementById("topBanner").addEventListener("mousedown", function (event) {
	mouseCheck = true;
	event.preventDefault();
});

document.addEventListener("mouseup", function (event) {
	mouseCheck = false;
});

document.getElementById("colorSettings").addEventListener("mousemove", function(event) {
	if (mouseCheck) {
		document.getElementById("colorSettingsContainer").style.left = (event.clientX).toString() + "px";
		document.getElementById("colorSettingsContainer").style.top = event.clientY.toString() + "px";
	}
});

document.getElementById("colorSettingsContainer").addEventListener("mouseover", function (event) {
	clickCheck = false;
});

document.getElementById("colorSettingsContainer").addEventListener("mouseout", function (event) {
	clickCheck = true;
});

document.getElementById("colorSettings").addEventListener("click", function (event) {
	if (clickCheck) {
		document.getElementById("colorSettings").style.display = "none";
	}
});

for (let key in pthemesElements) { // Itération sur les lignes de boutons
    document.querySelectorAll("." + key).forEach(function(element) { // Itération sur tous les boutons
        var children = element.children;
        for (let i = 0; i < children.length; i++) { // Itération sur tous les boutons
            children[i].addEventListener("click", function (e) { // Ajout d'un onclick
                changeTheme("personnalisable");
                if (!pthemesElements[key].includes(children[i].value)) { // Si l'élément n'est pas déjà sélectionné
                    if (key != pthemes[pthemes.length-1]) { // Afficher la ligne suivante
                        document.querySelector("." + pthemes[pthemes.indexOf(key)+1]).style.display = "initial";
                    }
                    else {
                        document.querySelector(".color-selection-container").style.display = "initial";
                    }
					// Modifier style bouton
                    children[i].style.border = "2px solid yellow";
                    children[i].style.background = "rgb(255, 255, 153)";
                    pthemesElements[key].push(children[i].value);
                }
                else { // Si élément déjà présent
					// Style de base
                    children[i].style.border = "2px outset buttonborder";
                    children[i].style.background = "buttonface";
                    const index = pthemesElements[key].indexOf(children[i].value); // Trouver l'index de l'élément
                    if (index > -1) { 
                        pthemesElements[key].splice(index, 1); // Enlever élément de la liste
                    }
                    if (pthemesElements[key].length == 0) { // Enlever lignes non nécessaires
                        document.querySelector(".color-selection-container").style.display = "none";

                        if (key == pthemes[0]) {
                            for (let j = 1; j < pthemes.length; j++) {
                                pthemesElements[pthemes[j]] = [];
                                var children_ = document.querySelector("." + pthemes[j]).children;
                                for (let k = 0; k < children_.length; k++) {
                                    children_[k].style.border = "2px outset buttonborder";
                                    children_[k].style.background = "buttonface";
                                }
                                document.querySelector("." + pthemes[j]).style.display = "none";
                            }
                        }
                    }
                }
            });
        }
    });
}

document.getElementById("colorElement").addEventListener("input", function (e) {
    changeColor(true);
	changeColor();
});

document.getElementById("leftProfileSettings").addEventListener("click", function (e) {
	document.getElementById("profileSettingsContainer").style.display = "block";
});


function acceptContact(contactName, mode=1) {
    fetch("http://127.0.0.1:5000/acceptcontactrequest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username,
            "request_username": contactName,
			"mode": mode,
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
        acceptContact(profileName, 0);
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

    let p = document.createElement("p");
    p.textContent = message[2];
    
    if (message[0] == username) {
        messageContainer.classList.add("right");
        p.classList.add("right-p");
    }
    else {
        messageContainer.classList.add("left");
        p.classList.add("left-p");
    }

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
                addRequestContainer(requests[i]);
            }
        }
    })
    .catch(error => console.error(error));
}

async function setContactsLeft() {
    // Actualise les contacts dans la barre de gauche
    try {
        const response = await fetch("http://127.0.0.1:5000/getcontacts", { // Attendre que la fonction ait fini avant de continuer
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": username,
            })
        });

        const data = await response.json();
        contacts = data.data;

        if (JSON.stringify(contacts) != JSON.stringify(globalContacts)) { // Eviter la comparaison de la position dans la mémoire
            document.querySelector(".left-contacts-container").innerHTML = ""; // Efface le contenu de la div
            if (contacts.length != 0) {
                for (i = 0, len = contacts.length; i < len; i++) {
                    addContactContainer(contacts[i]);
                }
            }
        }

        globalContacts = contacts;
    }
    catch (error) {
        console.error(error);
    }
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
                document.querySelector(".mid-messages-container").innerHTML = ""; // Efface le contenu de la div
                if (messages.length != 0) {
                    for (let j = 0, len = messages.length; j < len; j++) {
                        addMessage(messages[j]);
                    }

                    globalLastMessage = messages[messages.length - 1];
                }
                changeTheme(globalTheme);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

function changeTheme(themeName, start_=false) {
    if (!(themes.includes(themeName))) {
        return 1;
    }

    globalTheme = themeName;

    if (themeName == "personnalisable") {
        changeColor();
    }

    var start = themeName + "-theme-";

    for (let key in themesElements) {
        for (let i = 0; i < themesElements[key].length; i++) {
            document.querySelectorAll("." + themesElements[key][i]).forEach(function(element) {
                if (!start_) {
                    for (let j = 0; j < themes.length; j++) {
                        element.classList.remove(themes[j] + "-theme-" + key);
                    }
                }
                element.classList.add(start+key);
            });
        }
    }   
}

function changeColor(val=false) {
	if (val) {
		for (let i = 0; i < pthemesElements["element-selection-container"].length; i++) { // Tous les éléments reçus
			var element_ = pthemesElements["element-selection-container"][i]; // Clé de themesElements
			for (let k = 0; k < pthemesElements["element-color-selection-container"].length; k++) {
				var selector = pthemesElements["element-color-selection-container"][k];
				var color = document.getElementById("colorElement").value;
				
				if (element_ in pthemesChoices) {
					pthemesChoices[element_][selector] = color;
				}
				else {
					pthemesChoices[element_] = {selector: color};
				}
			}
		}
	}
	else {
		for (element_ in pthemesChoices) {
			for (classNameIdx in themesElements[element_]) {
				for (selector in pthemesChoices[element_]) {
					var className = themesElements[element_][classNameIdx];
					var color = pthemesChoices[element_][selector];
					
					// console.log(className, selector, color);
					if (selector == "border") {
						color = "2px solid " + color;
					}
					
					document.querySelectorAll("." + className).forEach(function (element) {
						element.style.setProperty(selector, color);
					});
				}
			}
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

changeTheme("default", true);
window.setInterval(main, 350);
