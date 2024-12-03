from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
#used for hasing the password using this werkzeug.security module(sha256)
from werkzeug.security import generate_password_hash, check_password_hash 


app = Flask(__name__)
CORS(app)
# Database connection function
def get_db_connection():
    conn = sqlite3.connect('carpooling.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return "Welcome to the Carpooling App API!"


#USER ENDPOINTS

#user signup endpoint   curl -X POST http://127.0.0.1:5000/users/signup -H "Content-Type: application/json" -d "{\"name\": \" usr1 \",\"email\":\"aa@gmail.com\",\"password\":\"asd2s3\",\"phone_number\":2202450115}"

@app.route('/users/signup', methods=['POST'])
def signup():
    # data = request.get_json()
    # # name = data.get('name')
    # email = data.get('email')
    # password = data.get('password')
    # # phone_number = data.get('phone_number')

    # # Hash the password for security
    # # hashed_password = generate_password_hash(password, method='sha256')
    # hashed_password = generate_password_hash(password, method='scrypt')


    # conn = get_db_connection()
    # cursor = conn.cursor()
    
    # try:
       
    #     # cursor.execute('''INSERT INTO Users (name, email, password, phone_number)
    #     cursor.execute('''INSERT INTO Users (email, password)
    #                       VALUES (?, ?)''', (email, hashed_password))
    #     conn.commit()
    # except sqlite3.IntegrityError:
    #     conn.close()
    #     return jsonify({"error": "Email or phone number already exists"}), 400
    
    # conn.close()
    # return jsonify({"message": "User created successfully!"}), 201
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Hash the password
    hashed_password = generate_password_hash(password, method='scrypt')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('INSERT INTO Users (email, password) VALUES (?, ?)', (email, hashed_password))
        conn.commit()
    except sqlite3.IntegrityError as e:
        conn.close()
        return jsonify({"error": "Email already exists", "details": str(e)}), 400
    finally:
        conn.close()

    return jsonify({"message": "User created successfully!"}), 201

#user signin endpoint   curl -X POST http://127.0.0.1:5000/users/signin -H "Content-Type: application/json" -d "{\"email\":\"abc@gmail.com\",\"password\":\"asd23\"}"
@app.route('/users/signin',methods=['POST'])
def signin():
    data=request.get_json()
    email = data['email']
    password = data['password']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM Users WHERE email = ?', (email,))
    user = cursor.fetchone()
    conn.close()

    if user is None or not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid email or password"}), 401
    
    return jsonify({"message": f"Welcome {user['name']}!","user_id": user['user_id'] }), 200


#go to '/users' to see all users
@app.route('/users',methods=['GET'])
def getAlluser():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Query to fetch all user details except the password
    cursor.execute("SELECT user_id, name, email, phone_number FROM users")
    users = cursor.fetchall()
    
    # Convert the rows into a list of dictionaries
    users_list = [dict(user) for user in users]
    
    conn.close()
    return jsonify(users_list), 200

#curl -X GET http://127.0.0.1:5000/users/2132452115
#user profile fetch
@app.route('/users/<int:userid>', methods=['GET'])
def getUser(userid):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM Users WHERE user_id = ?', (userid,))
    user = cursor.fetchone()
    
    conn.close()

    if user is None:
        return jsonify({"error": "User not found"}), 404

    user_dict = dict(user)
    return jsonify(user_dict), 200


#user profile update
#curl -X PUT http://127.0.0.1:5000/users/update/2 -H "Content-Type: application/json" -d "{\"name\": \"Updated Name\", \"email\": \"updated_email@example.com\", \"phone_number\": 9876543210,\"vehicle_capacity\":5}"

#data['name']: Use when the key must be present, and you want an error if it's not.
#data.get('name'): Use when the key is optional or when you want to handle missing keys gracefully.

@app.route('/users/update/<int:userid>', methods=['PUT'])
def update_user(userid):
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone_number = data.get('phone_number')
    license_number = data.get('license_number')
    vehicle_type = data.get('vehicle_type')
    vehicle_model = data.get('vehicle_model')
    vehicle_registration_number = data.get('vehicle_registration_number')
    vehicle_capacity = data.get('vehicle_capacity')

    conn = get_db_connection()
    cursor = conn.cursor()

    # Ensure the user exists
    cursor.execute('SELECT * FROM Users WHERE user_id = ?', (userid,))
    user = cursor.fetchone()

    if user is None:
        conn.close()
        return jsonify({"error": "User not found"}), 404

   # Update the user details
    cursor.execute('UPDATE Users SET name = ?, email = ?, phone_number = ?, license_number = ? , vehicle_type = ? , vehicle_model =?, vehicle_registration_number=? , vehicle_capacity=? WHERE user_id = ?', (name, email, phone_number,license_number,vehicle_type,vehicle_model, vehicle_registration_number, vehicle_capacity, userid))


    conn.commit()
    conn.close()

    return jsonify({"message": "User information updated successfully!"}), 200


#delete a user
#curl -X DELETE http://127.0.0.1:5000/users/delete/1

@app.route('/users/delete/<int:userid>', methods=['DELETE'])
def delete_user(userid):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if the user exists
    cursor.execute('SELECT * FROM Users WHERE user_id = ?', (userid,))
    user = cursor.fetchone()

    if user is None:
        conn.close()
        return jsonify({"error": "User not found"}), 404

    # Delete the user
    cursor.execute('DELETE FROM Users WHERE user_id = ?', (userid,))
    conn.commit()
    conn.close()

    return jsonify({"message": "User deleted successfully!"}), 200


#ride endpoint

#create ride
# curl -X POST http://127.0.0.1:5000/rides -H "Content-Type: application/json" -d "{\"user_id\": 2, \"origin\": \"City A\", \"destination\": \"City B\", \"departure_time\": \"2024-08-30 10:00:00\", \"available_seats\": 3, \"price\": 25.00}"


@app.route('/rides', methods=['POST'])
def create_ride():
    data = request.get_json()
    user_id = data.get('user_id')
    origin = data.get('source')
    destination = data.get('destination')
    departure_time = data.get('time')
    available_seats = data.get('seats_available')
    price = data.get('price')

    conn = get_db_connection()
    cursor = conn.cursor()

    # Insert the new ride into the Rides table
    cursor.execute('''
        INSERT INTO Rides (user_id, origin, destination, departure_time, available_seats, price)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (user_id, origin, destination, departure_time, available_seats, price))

    conn.commit()
    conn.close()

    return jsonify({"message": "Ride created successfully!"}), 201

@app.route('/rides', methods=['GET'])
def get_filtered_rides():
    source = request.args.get('source')
    destination = request.args.get('destination')

    if not source or not destination:
        return jsonify({"error": "Source and destination are required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            '''
            SELECT Rides.ride_id, Rides.origin, Rides.destination, Rides.departure_time, 
                   Rides.available_seats, Users.name AS driver_name
            FROM Rides
            JOIN Users ON Rides.user_id = Users.user_id
            WHERE Rides.origin LIKE ? AND Rides.destination LIKE ?
            ''',
            (f"%{source}%", f"%{destination}%")  # Support partial matching
        )
        rides = cursor.fetchall()
        conn.close()

        # Format rides for JSON response
        ride_list = [
            {
                "ride_id": ride["ride_id"],
                "origin": ride["origin"],
                "destination": ride["destination"],
                "departure_time": ride["departure_time"],
                "available_seats": ride["available_seats"],
                "driver_name": ride["driver_name"],
            }
            for ride in rides
        ]

        return jsonify({"rides": ride_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/book', methods=['POST'])
def book_ride():
    data = request.get_json()
    user_id = data.get('user_id')  # This could come from the app's logged-in user context
    ride_id = data.get('ride_id')
    seats = data.get('available_seats')

    if not user_id or not ride_id or not seats:
        return jsonify({"error": "User ID, Ride ID, and number of seats are required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if seats are available
        cursor.execute(
            "SELECT available_seats FROM Rides WHERE ride_id = ?", (ride_id,)
        )
        ride = cursor.fetchone()
        if not ride or ride['available_seats'] < seats:
            return jsonify({"error": "Not enough seats available"}), 400

        # Update seats and insert booking
        cursor.execute(
            "UPDATE Rides SET available_seats = available_seats - ? WHERE ride_id = ?",
            (seats, ride_id),
        )
        cursor.execute(
            "INSERT INTO RidePassengers (user_id, ride_id, available_seats) VALUES (?, ?, ?)",
            (user_id, ride_id, seats),
        )
        conn.commit()
        conn.close()

        return jsonify({"message": "Booking confirmed"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update ride details   curl -X PUT http://127.0.0.1:5000/rides/update/1 -H "Content-Type: application/json" -d "{\"origin\": \"City C\", \"destination\": \"City D\", \"departure_time\": \"2024-08-31 12:00:00\", \"available_seats\": 4, \"price\": 30.00}"
@app.route('/rides/update/<int:ride_id>', methods=['PUT'])
def update_ride(ride_id):
    data = request.get_json()
    origin = data.get('origin')
    destination = data.get('destination')
    departure_time = data.get('departure_time')
    available_seats = data.get('available_seats')
    price = data.get('price')

    conn = get_db_connection()
    cursor = conn.cursor()

    # Ensure the ride exists
    cursor.execute('SELECT * FROM Rides WHERE ride_id = ?', (ride_id,))
    ride = cursor.fetchone()

    if ride is None:
        conn.close()
        return jsonify({"error": "Ride not found"}), 404

    # Update the ride details
    cursor.execute('''
        UPDATE Rides
        SET origin = ?, destination = ?, departure_time = ?, available_seats = ?, price = ?
        WHERE ride_id = ?
    ''', (origin, destination, departure_time, available_seats, price, ride_id))

    conn.commit()
    conn.close()

    return jsonify({"message": "Ride updated successfully!"}), 200



#delete a ride  curl -X DELETE http://127.0.0.1:5000/rides/delete/1

@app.route('/rides/delete/<int:ride_id>', methods=['DELETE'])
def delete_ride(ride_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if the ride exists
    cursor.execute('SELECT * FROM Rides WHERE ride_id = ?', (ride_id,))
    ride = cursor.fetchone()

    if ride is None:
        conn.close()
        return jsonify({"error": "Ride not found"}), 404

    # Delete the ride
    cursor.execute('DELETE FROM Rides WHERE ride_id = ?', (ride_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Ride deleted successfully"}), 200

#all rides curl -X GET http://127.0.0.1:5000/rides/all

@app.route('/rides/all', methods=['GET'])
def get_all_rides():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Query to fetch all rides
    cursor.execute('SELECT * FROM Rides')
    rides = cursor.fetchall()

    conn.close()

    # Convert the rows into a list of dictionaries
    rides_list = [dict(ride) for ride in rides]

    return jsonify(rides_list), 200

#Get Ride Details
#curl -X GET http://127.0.0.1:5000/rides/2

@app.route('/rides/<int:ride_id>', methods=['GET'])
def get_ride_details(ride_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Query to fetch ride details based on ride_id
    cursor.execute('SELECT * FROM Rides WHERE ride_id = ?', (ride_id,))
    ride = cursor.fetchone()

    conn.close()

    if ride is None:
        return jsonify({"error": "Ride not found"}), 404

    # Convert the row into a dictionary
    ride_dict = dict(ride)

    return jsonify(ride_dict), 200


#curl -X POST http://127.0.0.1:5000/rides/book/2 -H "Content-Type: application/json" -d "{\"user_id\": 2}"

# @app.route('/rides/book/<int:ride_id>', methods=['POST'])
# def book_ride(ride_id):
#     data = request.get_json()
#     user_id = data.get('user_id')

#     conn = get_db_connection()
#     cursor = conn.cursor()

#     # Check if the ride exists
#     cursor.execute('SELECT available_seats FROM Rides WHERE ride_id = ?', (ride_id,))
#     ride = cursor.fetchone()

#     if ride is None:
#         conn.close()
#         return jsonify({"error": "Ride not found"}), 404

#     available_seats = ride['available_seats']
    
#     # Check if there are available seats
#     if available_seats <= 0:
#         conn.close()
#         return jsonify({"error": "No available seats"}), 400

#     # Check if the user has already booked the ride
#     cursor.execute('SELECT * FROM RidePassengers WHERE ride_id = ? AND user_id = ?', (ride_id, user_id))
#     existing_booking = cursor.fetchone()

#     if existing_booking:
#         conn.close()
#         return jsonify({"error": "User has already booked this ride"}), 400

#     # Book the ride by inserting into RidePassengers table
#     cursor.execute('INSERT INTO RidePassengers (ride_id, user_id, booking_status) VALUES (?, ?, ?)',
#                    (ride_id, user_id, 'confirmed'))
    
#     # Decrease the number of available seats
#     cursor.execute('UPDATE Rides SET available_seats = available_seats - 1 WHERE ride_id = ?', (ride_id,))
    
#     conn.commit()
#     conn.close()

#     return jsonify({"message": "Ride booked successfully!"}), 200


#curl -X DELETE http://127.0.0.1:5000/rides/2/cancel -H "Content-Type: application/json" -d "{\"user_id\": 2}"
@app.route('/rides/<int:ride_id>/cancel', methods=['DELETE'])
def cancel_booking(ride_id):
    data = request.get_json()
    user_id = data.get('user_id')

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if the booking exists
    cursor.execute('SELECT * FROM RidePassengers WHERE ride_id = ? AND user_id = ?', (ride_id, user_id))
    booking = cursor.fetchone()

    if booking is None:
        conn.close()
        return jsonify({"error": "Booking not found"}), 404

    # Delete the booking
    cursor.execute('DELETE FROM RidePassengers WHERE ride_id = ? AND user_id = ?', (ride_id, user_id))

    conn.commit()
    conn.close()

    return jsonify({"message": "Booking cancelled successfully!"}), 200


#curl -X GET http://127.0.0.1:5000/rides/2/bookings

@app.route('/rides/<int:ride_id>/bookings', methods=['GET'])
def get_all_bookings_for_ride(ride_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch all bookings for the given ride_id
    cursor.execute('''
        SELECT u.user_id, u.name, u.email, u.phone_number, rp.booking_status
        FROM RidePassengers rp
        JOIN Users u ON rp.user_id = u.user_id
        WHERE rp.ride_id = ?
    ''', (ride_id,))
    
    bookings = cursor.fetchall()
    conn.close()

    if not bookings:
        return jsonify({"error": "No bookings found for this ride"}), 404

    # Convert the rows into a list of dictionaries
    bookings_list = [dict(booking) for booking in bookings]

    return jsonify(bookings_list), 200


#curl -X GET http://127.0.0.1:5000/users/2/bookings

@app.route('/users/<int:user_id>/bookings', methods=['GET'])
def get_all_rides_booked_by_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch all rides booked by the given user_id
    cursor.execute('''
        SELECT r.ride_id, r.origin, r.destination, r.departure_time, r.price, rp.booking_status
        FROM RidePassengers rp
        JOIN Rides r ON rp.ride_id = r.ride_id
        WHERE rp.user_id = ?
    ''', (user_id,))
    
    bookings = cursor.fetchall()
    conn.close()

    if not bookings:
        return jsonify({"error": "No bookings found for this user"}), 404

    # Convert the rows into a list of dictionaries
    bookings_list = [dict(booking) for booking in bookings]

    return jsonify(bookings_list), 200


# Run the Flask app
if __name__ == '__main__':
   app.run(host="0.0.0.0", port=5000, debug=True)