import sqlite3
from flask import g

DATABASE_URI = "database.db"

def get_db():
    db = getattr(g, 'db', None)
    if db is None:
        db = g.db = sqlite3.connect(DATABASE_URI)
    
    return db

def disconnect():
    db = getattr(g, 'db', None)
    if db is not None:
        g.db.close()
        g.db = None

def user_exist(email):
    DBresult = get_db().execute("SELECT email FROM User WHERE email = ?", [email])
    matches = DBresult.fetchone() #fetch only one row at a time
    DBresult.close()

    if matches is None:
        return False
    else:
        return True

def user_auth(email):
    DBresult = get_db().execute("SELECT password FROM User WHERE email = ?", [email])
    match = DBresult.fetchone() #fetch only one row at a time
    DBresult.close()

    if match is None:
        return
    else:
        return {"password":match[0]}

def create_user(email, password, firstName, familyName, gender, city, country):
    try:
        get_db().execute("INSERT INTO User(email, password, firstname, familyname, gender, city, country) VALUES(?, ?, ?, ?, ?, ? ,?)", 
        [email, password, firstName, familyName, gender, city, country])
        get_db().commit()
        return True
    except Exception as e:
        print(e)
        return False

def change_password(email, password):
    try:
        get_db().execute("UPDATE User SET password = ? WHERE email = ?", [password, email])
        get_db().commit()
        return True
    except Exception as e:
        print(e)
        return False

def get_data(email):
    DBresult = get_db().execute("SELECT email, firstname, familyname, gender, city, country FROM user WHERE email = ?", [email])
    match = DBresult.fetchone() #fetch only one row at a time
    DBresult.close()

    if match is None:
        return
    else:
        return {"email":match[0], "firstname":match[1], "familyname":match[2], "gender":match[3], "city":match[4], "country":match[5]}

def get_message(email):
    cursor = get_db().execute("select sender, message from messages where receiver like ?;", [email])
    matches = cursor.fetchall()
    cursor.close()

    result = []
    for index in range(len(matches)):
        result.append({"writer": matches[index][0], "content": matches[index][1]})
    
    return result

def post_message(sender,receiver,message):
    try:
        get_db().execute("INSERT INTO messages(receiver,sender,message) VALUES(?, ?, ?)", [receiver,sender,message])
        get_db().commit()
        return True
    except Exception as e:
        print(e)
        return False
    
def login_insert(token, email):
    try:
        get_db().execute("INSERT INTO loggedIn_User(token, email) VALUES(?, ?)", [token, email])
        get_db().commit()
        return True
    except Exception as e:
        print(e)
        return False
    
def login_get_email(token):
    DBresult = get_db().execute("SELECT email FROM loggedIn_User WHERE token = ?", [token])
    match = DBresult.fetchone() #fetch only one row at a time
    DBresult.close()
    if match is None:
        return
    else:
        return match[0]         #return email if found

def login_get_allToken(email):
    DBresult = get_db().execute("SELECT token FROM loggedIn_User WHERE email = ?", [email])
    matches = DBresult.fetchall() #fetch only one row at a time
    DBresult.close()
    if matches is None:
        return
    else:
        result = []
        for index in range(len(matches)):
            result.append(matches[index][0])
    
        return result           #return all tokens if found
    
def login_delete(token):
    try:
        get_db().execute("DELETE FROM loggedIn_User WHERE token = ?", [token])
        get_db().commit()
        return True
    except Exception as e:
        print(e)
        return False
