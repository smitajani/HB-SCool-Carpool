
"""CRUD operations."""

from model import (db, Parent, Child, School, Availability, 
Booked_Ride, connect_to_db)

from datetime import date, datetime, timedelta

from flask_sqlalchemy import get_debug_queries

if __name__ == '__main__':
    from server import app
    print("Calling connect to DB from crud.py")
    connect_to_db(app)


def get_parent_by_id(id):
    """ Return the record for parent by id """
    print("In get parent by id in CRUD.py")
    parent_by_id = db.session.query(Parent).filter(Parent.id == id).first()
    print(f'In CRUD.py: Fetched get_parent_by_id - {type(parent_by_id)}, {parent_by_id}')
    return parent_by_id

def get_parent_by_email(email):
    """ Return the record for parent by email """
    print("In get parent by email in CRUD.py")
    parent_by_email = db.session.query(Parent).filter(Parent.email == email).first() 
    print(f'In CRUD.py: Fetched get_parent_by_email - {type(parent_by_email)}, {parent_by_email}')
    return parent_by_email

def get_children_by_parent_id(parent_id):
    """ Return the record for child by parent id """
    print("In get children by parent id in CRUD.py")
    return db.session.query(Child).filter(Child.parent_id == parent_id).first() 

def get_schools_by_zipcode(zipcode):
    """ Return the records for all schools in zipcode """
    print("In get schools by zip code in CRUD.py", zipcode)

    schools = db.session.query(School).filter(School.zipcode == zipcode).all()
    print(f'In CRUD.py: Fetched get_schools_by_zipcode - {type(schools)}, {schools}')
    print(schools)
    print("Printed schools above..")
    
    
    return schools

# Get open availability by school for the week (Mon to Fri) for a given parent to book rides
def get_open_availability_by_school(school_id, parent_id, week_start_date):
    """ Return the availability records for a school and given week start date """
    print("---> 1. CRUD.py: Get availability by school & week start date. Type(week_start_date): ", type(week_start_date))
    print("---> 2. CRUD.py: Get availability by school & week start date. Computed week end date: ", datetime.strptime(week_start_date, "%Y%m%d")+timedelta(days=5))

    availabilities = db.session.query(Availability, Parent).join(Parent, Parent.id == Availability.parent_id)\
        .filter(Availability.school_id == school_id)\
        .filter(Availability.parent_id != parent_id).filter(Availability.available_spots > 0)\
        .filter(Availability.ride_date.between(datetime.strptime(week_start_date, "%Y%m%d"), \
            datetime.strptime(week_start_date, "%Y%m%d")+timedelta(days=5))).all()
    # info = get_debug_queries()[0]
    # print(info.statement, info.parameters)

    print("CRUD.py: Fetched open availability by school - ", type(availabilities), availabilities)
    return availabilities


# Get availability with all booked rides for a parent in a given week
def get_availability_by_school(parent_id, school_id, week_start_date):
    """ Return the availability records for a parent, school and given week start date """
    print("---> 1. CRUD.py: Get availability or a parent, school & week start date : ", parent_id, school_id, (week_start_date))

    availabilities = db.session.query(Availability).filter(Availability.school_id == school_id)\
        .filter(Availability.parent_id == parent_id)\
        .filter(Availability.ride_date.between(datetime.strptime(week_start_date, "%Y%m%d"), \
            datetime.strptime(week_start_date, "%Y%m%d")+timedelta(days=5))).order_by(Availability.ride_date).all()
    # info = get_debug_queries()[0]
    # print(info.statement, info.parameters)
    print("CRUD.py: Fetched availability for parent, school & week - ", availabilities)
    return availabilities
    
# Get availability with all booked rides for a parent in a given week
# NOT USED THOUGH SINGLE QUERY RETURNS ALL INFO NEEDED FOR A WEEK - NESTED STRUCTURE MAKES IT COMPLEX FOR CLIENT SIDE PROCESSING
def get_availability_with_booked_rides(parent_id, school_id, week_start_date):
    """ Return the availability records with booked rides for a parent, school and given week start date """
    print("---> 1. CRUD.py: Get availability with booked rides for a parent, school & week start date : ", parent_id, school_id, (week_start_date))

    availabilityWithBookedRides = db.session.query(Availability, Booked_Ride, Child, Parent).\
        outerjoin(Booked_Ride, Booked_Ride.availability_id == Availability.id).\
        outerjoin(Parent, Parent.id == Booked_Ride.parent_id).\
        outerjoin(Child, Child.id == Booked_Ride.child_id).filter(Availability.parent_id == parent_id)\
        .filter(Availability.school_id == school_id)\
        .filter(Availability.ride_date.between(datetime.strptime(week_start_date, "%Y%m%d"), \
            datetime.strptime(week_start_date, "%Y%m%d")+timedelta(days=5))).order_by(Availability.ride_date).all()
    # info = get_debug_queries()[0]
    # print(info.statement, info.parameters)
    print("CRUD.py: Fetched availability with booked rides for parent & week - ", availabilityWithBookedRides)
    return availabilityWithBookedRides

# Get booked rides with driver information for a parent in a given week
def get_booked_rides_with_driver_info(parent_id, school_id, week_start_date):
    """ Return the booked ride records with driver information for a parent, school and given week start date """
    print("---> 1. CRUD.py: Get booked ride records with driver information for a parent, school & week start date : ", parent_id, school_id, (week_start_date))

    bookedRidesWithDriverInfo = db.session.query(Booked_Ride, Availability, Parent).\
        join(Availability, Availability.id == Booked_Ride.availability_id).\
        join(Parent, Parent.id == Availability.parent_id).filter(Booked_Ride.parent_id == parent_id)\
        .filter(Availability.school_id == school_id)\
        .filter(Availability.ride_date.between(datetime.strptime(week_start_date, "%Y%m%d"), \
            datetime.strptime(week_start_date, "%Y%m%d")+timedelta(days=5))).order_by(Availability.ride_date).all()
    # info = get_debug_queries()[0]
    # print(info.statement, info.parameters)
    print("CRUD.py: Fetched booked ride records with driver information for parent, school & week - ", bookedRidesWithDriverInfo)
    return bookedRidesWithDriverInfo

# Get rider information for availability of a parent in a given week for a school
def get_booked_rides_for_availability(availability_id):
    """ Return the booked ride records for an availability """
    print("---> 1. CRUD.py: Get booked ride records for an availability : ", availability_id)

    bookedRidesWithRiderInfo = db.session.query(Booked_Ride, Parent).\
        join(Parent, Parent.id == Booked_Ride.parent_id).\
        join(Child, Child.id == Booked_Ride.child_id).\
        filter(Booked_Ride.availability_id == availability_id)\
        .order_by(Booked_Ride.booking_date).all()
    # info = get_debug_queries()[0]
    # print(info.statement, info.parameters)
    print("CRUD.py: Fetched booked ride records with rider information for availability - ", bookedRidesWithRiderInfo)
    return bookedRidesWithRiderInfo


# Get all the records from a table
def get_all(table):
    """ Return a list of all records from table specified (Parent, School, Child, 
        Availability or Booked_Ride) """
    return db.session.query(table).all()

# Create parent method
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

# Create child method
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

# Create school method
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

# Create availability method
def create_availability(parent_id, school_id, total_spots, available_spots,
                ride_date, to_school_flag):

    """Create and return a new availability """
    print("In crud.py - create availability ", parent_id, school_id, total_spots, available_spots,
                ride_date, to_school_flag)

    availability = Availability(parent_id = parent_id, 
                            school_id = school_id, 
                            total_spots = total_spots, 
                            available_spots = available_spots,
                            ride_date = ride_date, 
                            to_school_flag = to_school_flag)

    db.session.add(availability)
    db.session.commit()

    return availability
