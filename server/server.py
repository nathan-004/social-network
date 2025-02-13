from flask import Flask, request, jsonify
from database import Database

app = Flask(__name__)

db_profile = Database()

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

    if not db_profile.user_exist(username):
        try:
            db_profile.add_user(username, password)
            response["code"] = 0
            response["message"] = "Utilisateur ajouté"
        except:
            response["code"] = 2
            response["message"] = "Une erreur inattendue s'est produite"
    else:
        response["code"] = 1
        response["message"] = "Nom d'utilisateur déjà utilisé"

    response = jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")  # Autorise toutes les origines
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "POST")

    print("Utilisateur: "+ username, "Mot de passe: " + password)

    return response

if __name__ == "__main__":
    app.run()
