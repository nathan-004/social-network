from flask import Flask, request, jsonify
from database import Database

app = Flask(__name__)

#------------------------------------------Database-----------------------------------
def add_new_user(username, password):
    pass


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

    response = add_new_user(username, password)
    response.headers.add("Access-Control-Allow-Origin", "*")  # Autorise toutes les origines
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "POST")

    print(f"Utilisateur: {username}, Mot de passe: {password}")

    return response

if __name__ == "__main__":
    app.run()