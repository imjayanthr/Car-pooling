import sqlite3

conn = sqlite3.connect('carpooling.db')
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name!= 'sqlite_sequence' ;")
tables = cursor.fetchall()

for table in tables:
    table_name = table[0]
    # cursor.execute(f"DELETE from {table_name};")
    print(f"All data deleted from {table_name}")
    #to delete tables and data
    cursor.execute(f"DROP TABLE IF EXISTS {table_name};") 
# Commit changes and close the connection
conn.commit()
conn.close()
