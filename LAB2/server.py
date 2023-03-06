from flask import Flask, request, jsonify
import re           #For email validation
import uuid         #For generating token
import database_handler

app = Flask(__name__)

@app.route("/", methods = ['GET'])
def root():
    return "works", 200

@app.teardown_request
def teardown(exception):
    database_handler.disconnect()

@app.route('/sign_in', methods = ['POST'])
def sign_in():
    userData = request.get_json()
    validateDataResp = validate_data(userData)
    if validateDataResp['success']:
        if 'email' in userData and 'password' in userData:
            #"Make email case insensitive"
            userEmail = userData["email"].lower() 
            dbResp = database_handler.user_auth(userEmail)
            if dbResp is not None:
                if dbResp['password'] == userData['password']:
                    #"Create ramdom token"
                    token = str(uuid.uuid4()) 
                    if (database_handler.login_insert(token, userEmail)):
                        return jsonify({"data": token}), 201    #[Created] User stored as logged in
                    else:
                        return "", 500                          #[Internal Server Error] Token failed to be inserted in the database "Could not sign in"
                else:
                    return "", 401                              #[Unauthorized] Unauthorised to sign in because password doesnot match "Wrong password given"
            else:
                return "", 404                                  #[Not Found] "Email not found" "No user found"
        else:
            return "", 400                                      #[Bad Request] "Missing email or password" "Missing Properties"
    else:
        return "", 422                                          #[Unprocessable Entity] Data Validation failed

@app.route('/sign_up', methods = ['POST'])
def sign_up():
    userData = request.get_json()
    validateDataResp = validate_data(userData)
    if validateDataResp['success']:
        if  'email'      in userData and \
            'password'   in userData and \
            'firstname'  in userData and \
            'familyname' in userData and \
            'gender'     in userData and \
            'city'       in userData and \
            'country'    in userData:
            #"Make email case insensitive"
            userEmail = userData["email"].lower() 
            if (not database_handler.user_exist(userEmail)):
                dbResp = database_handler.create_user(userEmail,
                                                      userData["password"], 
                                                      userData["firstname"], 
                                                      userData["familyname"], 
                                                      userData["gender"], 
                                                      userData["city"], 
                                                      userData["country"])
                if dbResp:
                    return "", 201                              #[Created] new user stored "User Created"
                else:
                    return "", 500                              #[Internal Server Error] New user failed to be inserted in the database "User could not be created"
            else:
                return "", 409                                  #[Conflict] "Email already exists" "User with email "+userEmail+" already exists"
        else:
            return "", 400                                      #[Bad Request] "Missing email or password or others" "Missing Properties"
    else:
        return "", 422                                          #[Unprocessable Entity] Data Validation failed

@app.route('/token/sign_out', methods = ['POST'])
def sign_out():
    token = request.headers.get("auth")
    validateTokenResp =  validate_token(token)
    if validateTokenResp["success"]:
        # set user to not logged in
        if (database_handler.login_delete(token)):
            return "", 200                                      #[OK] "Successfully signed out" 204
        else:
            return "", 500                                      #[Internal Server Error] "Unable to sign out" "Could not sign out"
    else:
        return "", 401                                          #[Unauthorized] "Invalid token" "You are not signed in." "Authentication required" "No token Received"

@app.route('/token/change_password', methods = ['PUT'])
def change_password():
    token = request.headers.get("auth")
    validateTokenResp =  validate_token(token)
    if validateTokenResp['success']:
        userData = request.get_json()
        validateDataResp = validate_data(userData)
        if validateDataResp['success']:
            if 'oldPassword' in userData and 'newPassword' in userData:
                dbResp = database_handler.user_auth(validateTokenResp['email'])
                if dbResp is not None:
                    if dbResp['password'] == userData['oldPassword']:
                        dbResp = database_handler.change_password(validateTokenResp['email'],userData["newPassword"])
                        if dbResp:
                            return "", 200                      #[OK] "Password updated successfully" "Password changed"
                        else:
                            return "", 500                      #[Internal Server Error] "Unable to update password" "Could not change password"
                    else:
                        return "", 422                          #[Unprocessable Entity] Unprocessable Entity because "Password does not match"
                else:
                    return "", 404                              #[Not Found] "Email not found" "No user found"
            else:
                return "", 400                                  #[Bad Request] "Missing oldpassword or newpassword" "Missing Properties"
        else:
            return "", 422                                      #[Unprocessable Entity] Data Validation failed
    else:
        return "", 401                                          #[Unauthorized] "Invalid token" "You are not signed in." "Authentication required" "No token Received"
##---------------------------------------------------------------------------------------------------------
@app.route('/token/get_data', methods = ['GET'])
def get_user_data_by_token():
    return get_user_data_by_email()

@app.route('/email/get_data/<email>', methods = ['GET'])
def get_user_data_by_email(email = ""):
    token = request.headers.get("auth")
    validateTokenResp =  validate_token(token)
    if validateTokenResp['success']:
        if len(email) > 0:
            #"Make email case insensitive"
            dataResp = get_user_data(email.lower())
        else:
            dataResp = get_user_data(validateTokenResp['email'])
        return jsonify(dataResp[0]), dataResp[1]
    else:
       return "", 401                                           #[Unauthorized] "Invalid token" "You are not signed in." "Authentication required" "No token Received"
    
##---------------------------------------------------------------------------------------------------------
@app.route('/token/get_message', methods = ['GET'])
def get_user_message_by_token():
    return get_user_message_by_email()

@app.route('/email/get_message/<email>', methods = ['GET'])
def get_user_message_by_email(email = ""):
    token = request.headers.get("auth")
    validateTokenResp =  validate_token(token)
    if validateTokenResp['success']:
        if len(email) > 0:
            #"Make email case insensitive"
            messageResp = get_user_message(email.lower()) 
        else:
            messageResp = get_user_message(validateTokenResp['email'])
        return jsonify(messageResp[0]), messageResp[1]
    else:
        return "", 401                                          #[Unauthorized] "Invalid token" "You are not signed in." "Authentication required" "No token Received"

##---------------------------------------------------------------------------------------------------------
@app.route('/token/post_message', methods = ['POST'])
def post_message():        
    token = request.headers.get("auth")
    validateTokenResp =  validate_token(token)
    if validateTokenResp['success']:
        userData = request.get_json()
        validateDataResp = validate_data(userData)
        if validateDataResp['success']:
            if 'email' in userData and 'message' in userData:
                #"Make email case insensitive"
                userEmail = userData["email"].lower() 
                if (database_handler.user_exist(userEmail)):
                    dbResp = database_handler.post_message(validateTokenResp['email'],userEmail,userData["message"])
                    if dbResp:
                        return "", 201                          #[Created] "Message posted successfully" "Message posted"
                    else:
                        return "", 500                          #[Internal Server Error] "Unable to post message" "Could not post message"
                else:
                    return "", 404                              #[Not Found] "Email not found" "No user found"
            else:
                return "", 400                                  #[Bad Request] "Missing email or message" "Missing Properties"
        else:
            return "", 422                                      #[Unprocessable Entity] Data Validation failed
    else:
        return "", 401                                          #[Unauthorized] "Invalid token" "You are not signed in." "Authentication required" "No token Received"

if __name__ == '__main__':
    app.debug = True
    app.run()

##--------------------------------HELPER FUNCTIONS---------------------------------------------------------------------------------
def get_user_data(email):
    data = {"email":email}
    validateDataResp =  validate_data(data)
    if validateDataResp['success']:
        dbResp = database_handler.get_data(data["email"])
        if dbResp is not None:
            return {"data": dbResp}, 200                        #[OK] "Getting User Data"
        else:
            return "", 500                                      #[Internal Server Error] "Failed to get User Data."
    else:
        return "", 422                                          #[Unprocessable Entity] Data Validation failed
    
def get_user_message(email):
    userData = {"email":email}
    validateDataResp =  validate_data(userData)
    if validateDataResp['success']:
        if (database_handler.user_exist(userData['email'])):
            dbResp = database_handler.get_message(userData['email'])
            return {"data": dbResp}, 200                        #[OK] "Getting messages" (could be empty)
        else:
            return "", 404                                      #[Not Found] "Email not found" "No user found"
    else:
        return "", 422                                          #[Unprocessable Entity] Data Validation failed
    
def validate_data(userData):
    # For all data standard error checks
    for key, value in userData.items():
        val_len = len(value)
        if key == 'password' or key == 'oldPassword' or key == 'newPassword':
            if val_len < 6:
                #"Password should be more tham 6 characters"
                return {"success":False} 
        elif key == 'email':
            if not correctEmail(value):
                #"Not entered correct email"
                return {"success":False} 
        elif key == 'message':
            if val_len > 500:
                #"Database does not support character length more than 500"
                return {"success":False} 
        if val_len < 1:
            #"Field is empty"
            return {"success":False}     
        if val_len > 50 and not key == 'message':
            #"Database does not support character length more than 50 for feild except message"
            return {"success":False}     
    return {"success":True}        

def validate_token(token):
    # All token standard error checks
    if token is None or len(token) < 1:
        # Server received no token
        return {"success":False}
    dbresp = database_handler.login_get_email(token)
    if dbresp is None:
        # User not signed in or invalid access token
        return {"success":False}
    return {"success":True, "email":dbresp}


# Define a function for
# validating an Email
def correctEmail(email):
    # Make a regular expression
    # for validating an Email
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    # pass the regular expression
    # and the string into the fullmatch() method
    if(re.fullmatch(regex, email)):
        return True     # valid Email
    else:   
        return False    # invalid Email
