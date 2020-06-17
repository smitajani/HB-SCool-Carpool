
"""CRUD operations."""

from model import (db, Parent, Child, School, Availability, 
Booked_Ride, connect_to_db)
import datetime


if __name__ == '__main__':
    from server import app
    print("Calling connect to DB from crud.py")
    connect_to_db(app)


def get_parent_by_id(id):
    """ Return the record for parent by id """
    print("In get parent by id in CRUD.py")
    return db.session.query(Parent).filter(Parent.id == id).first() 

def get_parent_by_email(email):
    """ Return the record for parent by email """
    print("In get parent by email in CRUD.py")
    return db.session.query(Parent).filter(Parent.email == email).first() 

def get_children_by_parent_id(parent_id):
    """ Return the record for child by parent id """
    print("In get children by parent id in CRUD.py")
    return db.session.query(Child).filter(Child.parent_id == parent_id).first() 

def get_all(table):
    """ Return a list of all records from table specified (Parent, School, Child, 
        Availability or Booked_Ride) """
    return db.session.query(table).all()


#Create parent method
def create_parent(parent_fname, parent_lname, 
                email, phone, address1, address2, 
                city, state, zipcode, last_login,
                created_on, password):

    """Create and return a new PARENT """
    print("In crud.py - create parent ", parent_fname, parent_lname,
        email, phone, address1, address2, 
        city, state, zipcode, last_login, created_on, password)

    parent = Parent(parent_fname = parent_fname, 
                    parent_lname = parent_lname, 
                    email = email, 
                    phone = phone,
                    address1 = address1,
                    address2 = address2,
                    state = state, 
                    city = city,
                    zipcode = zipcode,
                    last_login = "06/13/2020",
                    created_on = "06/13/2020",
                    password = password
                    )

    db.session.add(parent)
    db.session.commit()

    return parent

#Create child method
def create_child(child_fname, child_lname, grade, school_id,
                parent_id):

    """Create and return a new CHILD """
    print("In crud.py - create child ", child_fname, child_lname,
        grade, school_id, parent_id)

    child = Child(child_fname = child_fname, 
                    child_lname = child_lname, 
                    grade = grade, 
                    school_id = school_id,
                    parent_id = parent_id
                    )

    db.session.add(child)
    db.session.commit()

    return child

#Create school method
def create_school(school_name, office_email, office_phone, 
                    address1, address2, city, state, 
                    zipcode, school_district, school_website, 
                    mon_start_am, mon_end_pm,
                    tue_start_am, tue_end_pm, 
                    wed_start_am, wed_end_pm, 
                    thu_start_am, thu_end_pm, 
                    fri_start_am, fri_end_pm):

    """Create and return a new SCHOOL """

    school = School(school_name = school_name,
                    office_email = office_email,
                    office_phone = office_phone,
                    address1 = address1,
                    address2 = address2,
                    city = city,
                    state = state,
                    zipcode = zipcode,
                    school_district = school_district,
                    school_website = school_website,
                    mon_start_am = mon_start_am,
                    mon_end_pm = mon_end_pm,
                    tue_start_am = tue_start_am,
                    tue_end_pm = tue_end_pm,
                    wed_start_am = wed_start_am,
                    wed_end_pm = wed_end_pm,
                    thu_start_am = thu_start_am,
                    thu_end_pm = thu_end_pm,
                    fri_start_am = fri_start_am,
                    fri_end_pm = fri_end_pm
                    )

    db.session.add(school)
    db.session.commit()

    return school
