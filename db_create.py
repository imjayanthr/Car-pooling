import sqlite3

# Connect to the SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('carpooling.db')
cursor = conn.cursor()

# Create tables

# user table includes all the users (drivers included)
cursor.execute('''
CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT ,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone_number INTEGER UNIQUE,
    license_number TEXT UNIQUE ,
    vehicle_type TEXT ,
    vehicle_model TEXT ,
    vehicle_registration_number TEXT ,
    vehicle_capacity INTEGER
);
''')

cursor.execute('''
CREATE TABLE Rides (
    ride_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_time DATETIME NOT NULL,
    available_seats INTEGER NOT NULL,
    price REAL ,
    FOREIGN KEY(user_id) REFERENCES Users(user_id)
);
''')

cursor.execute('''
CREATE TABLE RidePassengers (
    ride_id INTEGER,
    user_id INTEGER,
    available_seats INTEGER,           
    PRIMARY KEY (ride_id, user_id),
    FOREIGN KEY(ride_id) REFERENCES Rides(ride_id),
    FOREIGN KEY(user_id) REFERENCES Users(user_id)
);
''')

# Commit changes and close the connection
conn.commit()
conn.close()

print("Database and tables created successfully.")
