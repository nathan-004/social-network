import sqlite3
import json
import time

class Database():
    def __init__(self, file="profiles.db"):
        self.conn = sqlite3.connect(file)
        self.cursor = self.conn.cursor()
        self.file = file
        self.table_creation()

    def table_creation(self):
        """
        Add a new table if it's not existing
        """
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                contacts TEXT,
                contacts_request_in TEXT)
        """)

        self.conn.commit()

    def read_data(self, username=None):
        """
        Read data in the table
        """

        if username is None:
            self.cursor.execute("SELECT * FROM users")
        else:
            self.cursor.execute("SELECT * FROM users WHERE username=?", (username,))
            return self.cursor.fetchall()

        users = self.cursor.fetchall() # Toutes les lignes / fetchone -> une seule ligne

        for user in users:
            print(user)


    def close(self):
        self.conn.close()

    def user_exist(self, username):
        """
        Returns True if a username is already took else returns False
        """

        self.cursor.execute("SELECT * FROM users WHERE username = ?", (username,))

        if self.cursor.fetchone() is None:
            return False

        return True

    def add_user(self, username, password):
        """
        Add a new user in the table
        """

        self.cursor.execute("INSERT INTO users (username, password, contacts, contacts_request_in) VALUES (?, ?, ?, ?)", (username, password, json.dumps([]), json.dumps([])))
        self.conn.commit()

    def reset_data(self):
        """
        Delete everything in the db
        """

        self.cursor.execute("DELETE FROM users")
        self.conn.commit()

    def connect_account(self, username, password):
        """
        Return True if the username and password is correct else False
        """

        self.cursor.execute("SELECT password FROM users WHERE username=?", (username,))

        if self.cursor.fetchone()[0] == password:
            return True
        else:
            return False

    def get_data(self, username, column="contacts"):
        """
        Return a list containing all the chosen data for a user
        """

        self.cursor.execute(f"SELECT {column} FROM users WHERE username=?", (username,))

        try:
            json_contacts = self.cursor.fetchone()[0]
        except TypeError:
            return []

        return list(set(json.loads(json_contacts)))

    def add_contact(self, username, contact_username):
        """
        Add a contact to the username
        """

        self.cursor.execute("UPDATE users SET contacts=? WHERE username = ?", (json.dumps(self.get_data(username)+[contact_username]), username))
        self.conn.commit()

    def add_contact_request(self, username, contact_username):
        """
        Send a contact request
        """

        self.cursor.execute("UPDATE users SET contacts_request_in=? WHERE username=?", (json.dumps(self.get_data(contact_username, "contacts_request_in")+[username]), contact_username))
        self.conn.commit()

    def accept_contact_request(self, username, request_username):
        """
        Accept a contact request from request_username on the username profile
        """

        contacts_requests = self.get_data(username, "contacts_request_in")
        print(username, request_username)
        
        if request_username in contacts_requests:
            self.add_contact(username, request_username)
            self.add_contact(request_username, username)
            a = contacts_requests.copy()
            for name in a:
                if name == request_username:
                    contacts_requests.pop(contacts_requests.index(request_username))
            self.cursor.execute("UPDATE users SET contacts_request_in=? WHERE username=?", (json.dumps(contacts_requests), username))
            self.conn.commit()

            return 0
        else:
            return 1
        
    def refuse_contact_request(self, username, request_username):
        contacts_requests = self.get_data(username, "contacts_request_in")
        
        if request_username in contacts_requests:
            a = contacts_requests.copy()
            for name in a:
                if name == request_username:
                    contacts_requests.pop(contacts_requests.index(request_username))
            self.cursor.execute("UPDATE users SET contacts_request_in=? WHERE username=?", (json.dumps(contacts_requests), username))
            self.conn.commit()
            return 0
        else:
            return 1

class Messages():
    def __init__(self, file="profiles.db"):
        self.conn = sqlite3.connect(file)
        self.cursor = self.conn.cursor()
        self.file = file
        self.table_creation()

    def table_creation(self):
        """
        Add a new table if it's not existing
        """

        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username1 TEXT NOT NULL,
                username2 TEXT NOT NULL,
                time int,
                sender TEXT,
                message TEXT)
        """)

        self.conn.commit()

    def read_data(self):
        self.cursor.execute("SELECT * FROM messages")

        messages = self.cursor.fetchall()

        for el in messages:
            print(el)
    
    def new_message(self, users, sender, message):
        """
        Add a new message in the conversation

        Parameters
        ----------
        users:list
            Liste des utilisateurs de taille 2
        sender:str
            Nom de l'envoyeur
        message:str
            Contenu du message
        """

        users.sort() # Trier dans l'ordre alphabétique
        user1, user2 = users[0], users[1]

        self.cursor.execute("INSERT INTO messages (username1, username2, time, sender, message) VALUES (?, ?, ?, ?, ?)", (user1, user2, int(time.time()), sender, message))
        self.conn.commit()

    def get_messages(self, users):
        """
        Return a list of all the messages sorted by time

        Parameters
        ----------
        users:list
            List of the two users
        """

        users.sort()

        self.cursor.execute("SELECT sender, time, message FROM messages WHERE username1=? AND username2=? ORDER BY time", (users[0], users[1]))
        messages = self.cursor.fetchall()

        return messages

if __name__ == "__main__":
    db = Database()
    db_messages = Messages()
    db.read_data()
    db_messages.new_message(["user1", "user2"], "user2", "Ceci est un test")
    db_messages.read_data()
    db_messages.get_messages(["user1", "user2"])
