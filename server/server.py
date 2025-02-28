from flask import Flask, request, jsonify
from database import Database

app = Flask(__name__)

@app.route('/register', methods=["POST", "OPTIONS"])
def register():
    if request.method == 'OPTIONS':
        # Répondre aux requêtes préflight (CORS)
        response = jsonify({"message": "CORS OK"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200

    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    response = {"code": 0,
        "message": "test"}
    
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

    response = jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")  # Autorise toutes les origines
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "POST")

    db_profile.close()

    return response

@app.route('/login', methods=["POST", "OPTIONS"])
def login():
    if request.method == 'OPTIONS':
        # Répondre aux requêtes préflight (CORS)
        response = jsonify({"message": "CORS OK"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200

    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    response = {"code": 0,
        "message": "test"}
    
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

    response = jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")  # Autorise toutes les origines
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "POST")

    db_profile.close()

    return response

@app.route('/addcontactrequest', methods=["POST", "OPTIONS"])
def getuser():
    if request.method == 'OPTIONS':
        # Répondre aux requêtes préflight (CORS)
        response = jsonify({"message": "CORS OK"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200

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

    response.headers.add("Access-Control-Allow-Origin", "*")  # Autorise toutes les origines
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "POST")

    return response

@app.route('/getcontactrequests', methods=["POST", "OPTIONS"])
def getcontactrequests():
    if request.method == 'OPTIONS':
        # Répondre aux requêtes préflight (CORS)
        response = jsonify({"message": "CORS OK"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200

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

    response.headers.add("Access-Control-Allow-Origin", "*")  # Autorise toutes les origines
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "POST")

    return response

if __name__ == "__main__":
    app.run()