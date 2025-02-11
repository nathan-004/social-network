from flask import Flask, request

app = Flask(__name__)

def add_new_user(username, password):
    """
    Add a new user in the profiles.json file

    Inputs
    ------
    username:str
    password:str

    Returns
    -------
    int
        0 if everything is ok
        1 if username is already took
    """

    print(username, password)
    return 0

@app.route('/register', methods=["GET", "POST"])
def register():
    if request.method == "GET":
        username = request.args.get("username")
        password = request.args.get("password")
        return add_new_user(username, password)

    elif request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        return add_new_user(username, password)

if __name__ == "__main__":
    app.run()
