import sqlite3

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
                password TEXT NOT NULL
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

if __name__ == "__main__":
    db = Database()