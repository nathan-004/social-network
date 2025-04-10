from flask import Flask, request, jsonify
from functools import wraps

from database import Database, Messages

app = Flask(__name__)


def cors_handler(func):
    @wraps(func) # Métadonnées de la fonction
    def wrapper(*args, **kwargs): # Gestion des paramètres
        if request.method == 'OPTIONS':
            response = jsonify({"message": "CORS OK"})
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add("Access-Control-Allow-Headers", "Content-Type")
            response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
            return response, 200

        # Exécuter la fonction originale
        response = func(*args, **kwargs)

        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST")

        return response
    return wrapper

@app.route('/register', methods=["POST", "OPTIONS"])
@cors_handler
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    response = {"code": 0, "message": "test"}
    
    db_profile = Database()

    if not db_profile.user_exist(username):
        try:
            db_profile.add_user(username, password)
            response["message"] = "Utilisateur ajouté"
        except:
            response["code"] = 2
            response["message"] = "Une erreur inattendue s'est produite"
    else:
        response["code"] = 1
        response["message"] = "Nom d'utilisateur déjà utilisé"

    print("Utilisateur: "+ username, "Mot de passe: " + password, "Reponse: " + response["message"])

    db_profile.close()

    return jsonify(response)

@app.route('/login', methods=["POST", "OPTIONS"])
@cors_handler
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    response = {"code": 0, "message": "test"}
    
    db_profile = Database()

    if db_profile.user_exist(username):
        if db_profile.connect_account(username, password):
            response["message"] = "Connexion réussie"
        else:
            response["code"] = 1
            response["message"] = "Mot de passe incorrect"
    else:
        response["code"] = 2
        response["message"] = "Nom d'utilisateur non-existant"

    print("Utilisateur: "+ username, "Mot de passe: " + password, "Reponse: " + response["message"])

    db_profile.close()

    return jsonify(response)

@app.route('/addcontactrequest', methods=["POST", "OPTIONS"])
@cors_handler
def addcontactrequest():
    data = request.get_json()
    username = data.get("username")
    contact_username = data.get("contact_username")

    response = {"code": 0,
        "message": "test"}
    
    db_profile = Database()

    if db_profile.user_exist(contact_username):
        try:
            db_profile.add_contact_request(username, contact_username)
            response["message"] = "Demande de contact envoyée"
        except:
            response["code"] = 2
            response["message"] = "Erreur inattendue"
    else:
        response["code"] = 1
        response["message"] = "L'utilisateur n'existe pas"

    print("Utilisateur: "+ username, "Reponse: " + response["message"])

    response = jsonify(response)

    return response

@app.route('/getcontactrequests', methods=["POST", "OPTIONS"])
@cors_handler
def getcontactrequests():
    data = request.get_json()
    username = data.get("username")

    response = {"code": 0,
        "message": "test",
        "data": []}
    
    db_profile = Database()

    response["data"] = db_profile.get_data(username, "contacts_request_in")
    response["message"] = "Succès"

    print("Utilisateur: "+ username, "Reponse: " + response["message"], "Data:", response["data"])

    response = jsonify(response)

    return response

@app.route('/acceptcontactrequest', methods=["POST", "OPTIONS"])
@cors_handler
def acceptcontactrequests():
    data = request.get_json()
    username = data.get("username")
    contact_request = data.get("request_username")
    mode = data.get("mode")

    response = {"code": 0,
        "message": "test",
        }
    
    db_profile = Database()
    if mode == 0:
        db_profile.refuse_contact_request(username, contact_request)
        response["message"] = "Demande de contact refusée"
    else:
        if db_profile.accept_contact_request(username, contact_request) == 0:
            response["message"] = "Contact ajouté"
        else:
            response["code"] = 1
            response["message"] = "Erreur innatendue"

    print("Utilisateur: "+ username, "Reponse: " + response["message"])

    response = jsonify(response)

    return response

@app.route('/getcontacts', methods=["POST", "OPTIONS"])
@cors_handler
def getcontacts():
    data = request.get_json()
    username = data.get("username")

    response = {"code": 0,
        "message": "test",
        "data": []
        }
    
    db_profile = Database()

    try:
        response["data"] = db_profile.get_data(username)
        response["message"] = "OK"
    except:
        response["code"] = 1
        response["message"] = "Erreur innatendue"

    print("Utilisateur: "+ username, "Reponse: " + response["message"], "Data:", response["data"])

    response = jsonify(response)

    return response

@app.route('/getmessages', methods=["POST", "OPTIONS"])
@cors_handler
def getmessages():
    data = request.get_json()
    username = data.get("username")
    contact = data.get("contact")
    mode = data.get("mode") # 0 -> le dernier message 1 -> L'ensemble des messages

    response = {"code": 0, 
        "message": "test",
        "data": []
        }
    
    db_messages = Messages()

    if mode == 0:
        try:
            response["data"] = db_messages.get_messages([username, contact])[-1]
            response["message"] = "OK"
        except:
            response["code"] = 1
            response["message"] = "Erreur innatendue"
    elif mode == 1:
        try:
            response["data"] = db_messages.get_messages([username, contact])
            response["message"] = "OK"
        except:
            response["code"] = 1
            response["message"] = "Erreur innatendue"

    print("Utilisateur: "+ username, "Reponse: " + response["message"], "Data:", response["data"])

    response = jsonify(response)

    return response

@app.route('/newmessage', methods=["POST", "OPTIONS"])
@cors_handler
def newmessage():
    data = request.get_json()
    sender = data.get("sender")
    contact = data.get("contact")
    message = data.get("message")

    response = {"code": 0,
        "message": "test"
        }
    
    db_messages = Messages()
    db_profile = Database()

    try:
        if db_profile.get_data(sender):
            db_messages.new_message([sender, contact], sender, message)
            response["message"] = "Message envoyé"
        else:
            response["code"] = 2
            response["message"] = "Utilisateurs non contacts"
    except:
        response["code"] = 1
        response["message"] = "Erreur innatendue"

    print("Utilisateur: "+ sender, "Reponse: " + response["message"])

    response = jsonify(response)

    return response

if __name__ == "__main__":
    app.run()
