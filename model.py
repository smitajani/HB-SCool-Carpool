"""Models for carpool app"""
from flask_sqlalchemy import SQLAlchemy
import datetime
db = SQLAlchemy()


class Parent(db.Model):
    """A parent"""

    __tablename__ = 'parent'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    parent_fname = db.Column(db.String, nullable=False)
    parent_lname = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    phone = db.Column(db.String, nullable=False)
    address1 = db.Column(db.String, nullable=False)
    address2 = db.Column(db.String)
    city = db.Column(db.String, nullable=False)
    state = db.Column(db.String, nullable=False) 
    zipcode = db.Column(db.String, nullable=False)
    last_login = db.Column(db.DateTime, nullable=False)
    created_on = db.Column(db.DateTime, nullable=False)
    password = db.Column(db.String, nullable=False)   # ADVISOR - Is Datatype = String good for encrypted pwd?

    def __repr__(self):
        return f'<Parent Account/Login id={self.id} email={self.email}>'





class Child(db.Model):
    """ A Child """

    __tablename__ = 'child'

    id = db.Column(db.Integer, autoincrement = True, primary_key = True)
    school_id = db.Column(db.Integer, db.ForeignKey('school.id'))
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'))

    child_fname = db.Column(db.String, nullable=False)
    child_lname = db.Column(db.String, nullable=False)
    grade = db.Column(db.String, nullable=False)

    # Define relationships 
    parent = db.relationship('Parent')

    def __repr__(self):
        return f'<Child child_id: {self.id}, Parent: \
        {parent.parent_fname} {parent.parent_lname}>'

class School(db.Model):
    """A school"""

    __tablename__ = 'school'


    id = db.Column(db.Integer, autoincrement = True, primary_key = True)

    school_name = db.Column(db.String, nullable=False)
    office_email = db.Column(db.String, nullable=False)
    office_phone = db.Column(db.String, nullable=False)

    address1 = db.Column(db.String, nullable=False)
    address2 = db.Column(db.String)
    city = db.Column(db.String, nullable=False)
    state = db.Column(db.String, nullable=False)
    zipcode = db.Column(db.String, nullable=False)
    
    school_district = db.Column(db.String, nullable=False)
    school_website = db.Column(db.String)

    mon_start_am = db.Column(db.String, nullable=False)
    mon_end_pm = db.Column(db.String, nullable=False)

    tue_start_am = db.Column(db.String, nullable=False)
    tue_end_pm = db.Column(db.String, nullable=False)

    wed_start_am = db.Column(db.String, nullable=False)
    wed_end_pm = db.Column(db.String, nullable=False)

    thu_start_am = db.Column(db.String, nullable=False)
    thu_end_pm = db.Column(db.String, nullable=False)

    fri_start_am = db.Column(db.String, nullable=False)
    fri_end_pm = db.Column(db.String, nullable=False)

    # Define relationships - DO WE NEED TO DEFINE THIS HEREE?
    child = db.relationship('Child')
    availability = db.relationship('Availability')


    def __repr__(self):
        return f'<School school_id={self.id} school name={self.school_name}>'


class Availability(db.Model):
    """ Availability of rides"""

    __tablename__ = 'availability'

    id = db.Column(db.Integer, autoincrement = True, primary_key = True)
    school_id = db.Column(db.Integer, db.ForeignKey('school.id'))
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'))

    total_spots = db.Column(db.Integer, nullable=False)
    available_spots = db.Column(db.Integer, nullable=False)
    ride_date = db.Column(db.DateTime, nullable=False)
    to_school_flag = db.Column(db.Boolean, nullable=False)  # if True, means ride is to drop kids off at school 
                                            # False means ride is to pick-up kids from school 
    
    school = db.relationship('School')
    parent = db.relationship('Parent')
    

    def __repr__(self):
        return f'<Availability availability_id: {self.id}, \
        Parent: {parent.parent_fname} {parent.parent_lname}, \
        School: {school.id} {school.school_name}>'


class Booked_Ride(db.Model):
    """ Availability of rides"""

    __tablename__ = 'booked_ride'

    id = db.Column(db.Integer, autoincrement = True, primary_key = True)
    booking_date = db.Column(db.DateTime, nullable=False)

    availability_id = db.Column(db.Integer, db.ForeignKey('availability.id'))
    parent_id = db.Column(db.Integer, db.ForeignKey('parent.id'))
    child_id = db.Column(db.Integer, db.ForeignKey('child.id'))
    
    # Define relationships
    availability = db.relationship('Availability')
    parent = db.relationship('Parent')
    child = db.relationship('Child')

    def __repr__(self):
        return f'<Booked Ride booked_ride_id: {self.id}, \
        availability_id: {availability.id}, \
        Parent: {parent.parent_fname} {parent.parent_lname}, \
        Child: {child.id} {child.child_fname} {child.child_lname}>'

def connect_to_db(flask_app, db_uri='postgresql:///carpool', echo=True):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    #flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('DB Connected successfully!')


if __name__ == '__main__':
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.
    print("Calling connect to DB from model.py")
    connect_to_db(app)
