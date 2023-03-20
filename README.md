#   TDDD97 Web Programming - Twidder (Completed)

##  Getting started

1.  [Install Python](https://www.python.org/downloads/)

2.  Put python to path environment

3.  [Install virtualenv using pipx](https://virtualenv.pypa.io/en/latest/installation.html#via-pipx) and make sure to [Install pipx](https://pypi.org/project/pipx/) first

4.  Make a directory to setup the virtual environment preferabily inside a users directory
    ```
    mkdir py_virEnv
    ```
    ```
    cd py_virEnv
    ```
    ```
    virtualenv -p python3 tddd97
    ```

5.  Activate the environment
	```
    cd tddd97
    ```
    ```
    Scripts\activate
    ```

    **Note [in Windows]**: While trying to activate the environment I got an error saying that "running scripts is disabled on this system".
    
    So I did:
    ```
    Set-ExecutionPolicy Unrestricted -Scope Process
    ```
    Then I could activated the environment and after that I did:

	```
    Set-ExecutionPolicy Default -Scope Process
    ```

    So that the system wont stay unsafe.

6.  Install Flask
	```
    pip install Flask
    ```

7.  Install Flask Socket
    ```
    pip install flask-sock
    ```

8.  Install Eventlet
	```
    pip install eventlet
    ```

##  Running the server
Run the server either in Development mode:	
```
flask --app server run --debug
```
Or in Production mode:
```
python server.py
```
##  Testing the server API using [Postman](https://www.postman.com/downloads/)
### Ideal Test Cases for Lab 2:
-   **SIGN UP:** 
    ```
    http://127.0.0.1:5000/sign_up
    ```
    POST Request
    
    Body in JSON example:
    ```
    {"firstname":"Rojal","familyname":"Maharjan","gender":"Male","city":"Linköping","country":"Sweden","email":"roj@gmail.com","password":"123456"}
    ```

-   **SIGN IN:**
    ```
    http://127.0.0.1:5000/sign_in
    ```
    POST Request
    
    Body in JSON example:
    ```
    {"email":"roj@gmail.com","password":"123456"}
    ```

-   **SIGN OUT:**
    ```
    http://127.0.0.1:5000/token/sign_out
    ```
    POST Request
    
    Header should have key "auth" and the value should the the data when signing in

-   **CHANGE PASSWORD:**
    ```
    http://127.0.0.1:5000/token/change_password
    ```
    PUT Request

    Header should have key "auth" and the value should the the data when signing in
    
    Body in JSON example:
{"oldPassword":"123456","newPassword":"098765"}

-   **GET USER DATA BY TOKEN:**
    ```
    http://127.0.0.1:5000/token/get_data
    ```
    GET Request

    Header should have key "auth" and the value should the the data when signing in

-   **GET USER DATA BY EMAIL:**
    ```
    http://127.0.0.1:5000/email/get_data/almaharjan@gmail.com
    ```
    GET Request
    
    Header should have key "auth" and the value should the the data when signing in

    HTTP URL should have an email at the end.

-   **GET USER MESSAGE BY TOKEN:**
    ```
    http://127.0.0.1:5000/token/get_message
    ```
    GET Request
    
    Header should have key "auth" and the value should the the data when signing in

-   **GET USER MESSAGE BY EMAIL:**
    ```
    http://127.0.0.1:5000/email/get_message/almaharjan@gmail.com
    ```
    GET Request

    Header should have key "auth" and the value should the the data when signing in

    HTTP URL should have an email at the end.

-   **POST MESSAGE**
    ```
    http://127.0.0.1:5000/token/post_message
    ```
    POST Request

    Header should have key "auth" and the value should the the data when signing in

    Body in JSON example:
    ```
    {"email":"roj@gmail.com","message":"hello!!"}
    ```
    
