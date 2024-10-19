import sqlite3

# Connect to the SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('carpooling.db')
cursor = conn.cursor()

# Query to list all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
# cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';") if the auto increment sequence table is not needed
tables = cursor.fetchall()

# Print the list of tables
print("Tables in the database:")
for table in tables:
    table_name = table[0]
    print(f"Table: {table_name}")

for table in tables:
    table_name = table[0]
    print(f"TABLE: {table_name}")

    # Get the column names
    cursor.execute(f"PRAGMA table_info({table_name});")
    column_names = [description[1] for description in cursor.fetchall()]
    print(f"Columns: {', '.join(column_names)}")

    # Query to select all data from the table
    cursor.execute(f"SELECT * FROM {table_name};")
    rows = cursor.fetchall()
    # Print each row of data
    if rows:
        for row in rows:
            print(row)
    else:
        print("No data available.")
    
    print("\n" + "-"*50 + "\n")

conn.close()
