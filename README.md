# Twidder - A Flask and WebSocket Chat Application

This web application allows users to sign up, sign in, post messages, and sign out using Flask and WebSockets for real-time communication.

## File List

*   `database_handler.py` - Handles interactions with the SQLite database.
*   `schema.sql` - Defines the database schema (tables and columns).
*   `server.py` - Contains the Flask server code, API endpoints, and WebSocket handling.
*   `client.css` - Contains the CSS styles for the client-side interface.
*   `client.html` - Contains the HTML structure of the client-side interface.
*   `client.js` - Contains the JavaScript code for client-side interactions and WebSocket communication.

## Database Schema

The application uses an SQLite database with the following tables:

**User Table**

|Column|Datatype|Constraints|
|:---|:---|:---|
|email|VARCHAR(50)|PRIMARY KEY, NOT NULL|
|password|VARCHAR(50)|NOT NULL|
|firstname|VARCHAR(50)|NOT NULL|
|familyname|VARCHAR(50)|NOT NULL|
|gender|VARCHAR(50)|NOT NULL|
|city|VARCHAR(50)|NOT NULL|
|country|VARCHAR(50)|NOT NULL|

**Messages Table**

|Column|Datatype|Constraints|
|:---|:---|:---|
|receiver|VARCHAR(50)|NOT NULL|
|sender|VARCHAR(50)|NOT NULL|
|message|VARCHAR(500)|NOT NULL|

**Logged In User Table**

|Column|Datatype|Constraints|
|:---|:---|:---|
|token|VARCHAR(50)|PRIMARY KEY, NOT NULL|
|email|VARCHAR(50)|NOT NULL|

## Installation and Running

1.  Install the required packages:
    ```bash
    pip install flask flask_sock sqlite3 eventlet
    ```
2.  Set up the database using `schema.sql`.
3.  Run the Flask server:
    ```bash
    python server.py
    ```
4.  Access the web application in your browser at `http://127.0.0.1:5000/`.

## API Endpoints

*   `/sign_up` (POST): Sign up a new user.
*   `/sign_in` (POST): Sign in a user.
*   `/token/sign_out` (POST): Sign out a user (requires authentication token).
*   `/token/change_password` (PUT): Change a user's password (requires authentication token).
*   `/token/get_data` (GET): Get user data by token (requires authentication token).
*   `/email/get_data/<email>` (GET): Get user data by email (requires authentication token).
*   `/token/get_message` (GET): Get user messages by token (requires authentication token).
*   `/email/get_message/<email>` (GET): Get user messages by email (requires authentication token).
*   `/token/post_message` (POST): Post a message (requires authentication token).
