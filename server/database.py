import sqlite3
import json

class Database():
    def __init__(self, file="profiles.db"):
        self.conn = sqlite3.connect(file)
        self.cursor = self.conn.cursor()
        self.file = file

    def table_creation(self):
        """
        Add a new table if it's not existing
        """
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                contacts TEXT, # Contient les contacts
            )
        """)

        self.conn.commit()

    def insert_data(self):
        """
        Insert new data in the table
        """
        self.cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", ("user1", "password123"))
        self.conn.commit()

    def read_data(self):
        """
        Read data in the table
        """
        self.cursor.execute("SELECT * FROM users")
        users = self.cursor.fetchall() # Toutes les lignes / fetchone -> une seule ligne

        for user in users:
            print(user)

    def update_data(self):
        self.cursor.execute("UPDATE users SET password = ? WHERE username = ?", ("newpassword123", "user1"))
        self.conn.commit()

    def delete_data(self):
        self.cursor.execute("DELETE FROM users WHERE username = ?", ("user1",))
        self.conn.commit()

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

        self.cursor.execute("INSERT INTO users (username, password) VALUES (?, ?, ?)", (username, password, json.dumps([]))
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
        
    def get_contacts(self, username):
        """
        Return a list containing all the username's contacts of a profile
        """
        
        self.cursor.execute("SELECT contacts FROM users WHERE username=")

if __name__ == "__main__":
    db = Database()
    print(db.connect_account("user2", "password123"))
