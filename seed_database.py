
"""Script to seed database."""

import os
import json
from random import choice, randint
from datetime import datetime

import crud
import model
import server

os.system('dropdb carpool')
os.system('createdb carpool')

model.connect_to_db(server.app)
model.db.create_all()


########### SCHOOL DATA
# Load school data from JSON file 
with open('data/schools.json') as f:
     schools_info = json.loads(f.read())

# Load school data
for school in schools_info:

    # Unpack the values & send as a list to create a record in the backend db
    # ADVISOR - Check if this is accurate: 'school' is a dictionary object and cannot be sent as a function argument

    school_name, office_email, office_phone, \
    address1, address2, city, state, zipcode, \
    school_district, school_website, \
    mon_start_am, mon_end_pm, \
    tue_start_am, tue_end_pm, \
    wed_start_am, wed_end_pm, \
    thu_start_am, thu_end_pm, \
    fri_start_am, fri_end_pm = (school['school_name'],
                                school['office_email'],
                                school['office_phone'],
                                school['address1'],
                                school['address2'],
                                school['city'],
                                school['state'],
                                school['zipcode'],
                                school['school_district'],
                                school['school_website'],
                                school['mon_start_am'],
                                school['mon_end_pm'],
                                school['tue_start_am'],
                                school['tue_end_pm'],
                                school['wed_start_am'],
                                school['wed_end_pm'],
                                school['thu_start_am'],
                                school['thu_end_pm'],
                                school['fri_start_am'],
                                school['fri_end_pm'])

    # Call create_school function from crud.py
    db_school = crud.create_school(school_name, \
                    office_email, office_phone, \
                    address1, address2, city, state, zipcode, \
                    school_district, school_website, \
                    mon_start_am, mon_end_pm, \
                    tue_start_am, tue_end_pm, \
                    wed_start_am, wed_end_pm, \
                    thu_start_am, thu_end_pm, \
                    fri_start_am, fri_end_pm)
    
    #Append the school info to list - if we ever need to use later to auto-generate emails or other fields  
    #schools_in_db.append(db_school)
    #print(f'DB School, {db_school}')


########### PARENT DATA
# Load parent data from JSON file generated from Faker
with open('data/parents.json') as f:
     parent_info = json.loads(f.read())


# Create & load parent
for parent in parent_info:
     print(f' Parent..., {parent}')

    # Unpack the values & send as a list to create a record in the backend db
    # ADVISOR - Check if this is accurate: 'school' is a dictionary object and cannot be sent as a function argument


     parent_lname, parent_fname, \
     email, phone, \
     address1, address2, city, state, zipcode, \
     created_on, last_login, password = (parent[0],
                                parent[1],
                                parent[2],
                                parent[3],
                                parent[4],
                                parent[5],
                                parent[6],
                                parent[7],
                                parent[8],
                                parent[9],
                                parent[10],
                                parent[11],
                              )

     # Call create_parent function from crud.py
     db_parent = crud.create_parent(parent_fname, parent_lname, \
                                   email, phone, address1, address2, \
                                   city, state, zipcode, last_login, \
                                   created_on, password)
     


########### CHILDREN DATA
# Load children data from JSON file generated using Faker
with open('data/children.json') as f:
     children_info = json.loads(f.read())


# Create & load child

for child in children_info:

    # Unpack the values & send as a list to create a record in the backend db
     child_fname, child_lname, grade, \
     school_id, parent_id = (child[0],
                              child[1],
                              child[2],
                              child[3],
                              child[4]
                              )

     # Call create_child function from crud.py
     db_child = crud.create_child(child_fname, child_lname, \
                                   grade, school_id, parent_id)