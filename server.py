from flask import (Flask, render_template, request, flash, 
jsonify, session, redirect)

from model import db, connect_to_db
import json
import crud

from jinja2 import StrictUndefined
import logging
logging.basicConfig(level=logging.DEBUG)
# app.jinja_env.undefined = StrictUndefined

from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.secret_key = "sjhbproject"    # Key for the flask toolbar. 
                                # Not sure if this is used anywhere else
                                # too
                                 


@app.route('/')
def homepage():
    """View homepage"""
    return render_template("homepage.html")

@app.route('/signup')
@app.route('/login')
def signup():
    """View SignUp"""
    print("In signup")
    return render_template("homepage.html")

@app.route('/api/parent/add', methods=['POST'])
def create_parent():
    print("In server.py create parentfunction")
    
    query_str_data = request.get_json()
 
    print("In server.py - ", query_str_data)

    parent_fname = query_str_data['parentFname'],
    parent_lname = query_str_data['parentLname'],
    email = query_str_data['email'],
    phone = query_str_data['phone'],
    address1 = query_str_data['address1'], 
    address2 = query_str_data['address2'],
    city = query_str_data['city'], 
    state = query_str_data['resState'], 
    zipcode = query_str_data['zipcode'], 
    last_login = "", 
    created_on = "",
    password = query_str_data['password']

    print("In server.py - ", parent_fname)

    try:
        result = crud.create_parent(parent_fname, 
                                    parent_lname, 
                                    email, 
                                    phone,
                                    address1,
                                    address2,
                                    state, 
                                    city,
                                    zipcode,
                                    last_login,
                                    created_on,
                                    password)
        return jsonify([result.id, email])

    except:
        result = "Error inserting parent"
        return result
    

@app.route('/api/parent/id=<id>')
def get_parent_by_id(id):
    parent_info = crud.get_parent_by_id(id)
    print("*** In server.py get_parent_by_id, ", parent_info.id, \
    parent_info.parent_fname)
    return jsonify({"id" : parent_info.id, 
                    "parentFname" : parent_info.parent_fname,
                    "parentLname": parent_info.parent_lname,
                    "email" : parent_info.email,
                    "phone" : parent_info.phone,
                    "address1" : parent_info.address1,
                    "address2" : parent_info.address2,
                    "resState": parent_info.state,
                    "city" : parent_info.city,
                    "zipcode" : parent_info.zipcode,
                    "last_login" : parent_info.last_login})


@app.route('/api/parent/email=<email>')
def get_parent_by_email(email):
    parent_info = crud.get_parent_by_email(email)
    print(f'*** In server.py get_parent_by_email, {parent_info.id}, \
    {parent_info.parent_fname}')
    return jsonify({"id" : parent_info.id, 
                    "parentFname" : parent_info.parent_fname,
                    "parentLname": parent_info.parent_lname,
                    "email" : parent_info.email,
                    "phone" : parent_info.phone,
                    "address1" : parent_info.address1,
                    "address2" : parent_info.address2,
                    "city" : parent_info.city,
                    "resState" : parent_info.state,
                    "zipcode" : parent_info.zipcode})

@app.route('/api/child/parent=<parent_id>')
def get_children_by_parent_id(parent_id):
    print("*** In server.py get_children_by_parent_id, ", parent_id)
    children_info = crud.get_children_by_parent_id(parent_id)
    if (children_info != None):
        print(f'*** In server.py get_children_by_parent_id, {children_info.id}, \
        {children_info.child_fname}')
        return jsonify({"id" : children_info.id, 
                    "childFname" : children_info.child_fname,
                    "childLname": children_info.child_lname,
                    "grade" : children_info.grade,
                    "schoolId" : children_info.school_id,
                    "parentId" : children_info.parent_id
                    })
    else:
        return jsonify({"id" : "", 
                    "childFname" : "",
                    "childLname": "",
                    "grade" : "",
                    "schoolId" : "",
                    "parentId" : ""
                    })

@app.route('/api/child/add', methods=['POST'])
def create_child():
    print("In server.py create childfunction")
    
    query_str_data = request.get_json()
 
    print("In server.py - create child ", query_str_data)

    child_fname = query_str_data['childFname'],
    child_lname = query_str_data['childLname'],
    grade = query_str_data['grade'],
    school_id = query_str_data['schoolId'],
    parent_id = query_str_data['parentId'], 

    try:
        result = crud.create_child(child_fname, 
                                    child_lname, 
                                    grade, 
                                    school_id,
                                    parent_id)
        return jsonify([result.id, child_fname])

    except:
        result = "Error inserting child"
        return result
    

# @app.route('/', defaults={'path':''})
# @app.route('/<path:path>')
# @app.route("/home")
# def show_path(path):
#     print("The path is: ", {path})
#     """Redirect to homepage"""
#  //   return redirect("/")


print("Calling connect to DB from server.py")
connect_to_db(app)

if __name__ == '__main__':
    
    # Flask Debugging - run Flask debug toolbar in BROWSER
    DebugToolbarExtension(app)
    app.run(host='0.0.0.0', debug=True)

    # Preserves context in Python INTERACTIVE SHELL
    app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = True
    