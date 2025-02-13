import sqlite3
import json

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

        return Truesss

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

        self.cursor.execute("SELECT ? FROM users WHERE username=?", (column, username))

        json_contacts = self.cursor.fetchone()[0]

        return json.loads(json_contacts)

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

if __name__ == "__main__":
    db = Database()
    db.reset_data()
    db.add_user("user1", "password1")
    print(db.get_data("user1"))
    db.add_contact("user1", "username23456")
    print(db.get_data("user1"))
    db.read_data()
