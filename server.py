from flask import (Flask, render_template, request, flash, 
jsonify, session, redirect)
from datetime import date, datetime, timedelta

from model import db, connect_to_db
import json
import crud
import requests #Make rest calls to MapBox API

from jinja2 import StrictUndefined
import logging
logging.basicConfig(level=logging.DEBUG)
# app.jinja_env.undefined = StrictUndefined

from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.secret_key = "sjhbproject"    # Key for the flask toolbar. 
                                # Not sure if this is used anywhere else
                                # too
mapboxBaseUrl = "https://api.mapbox.com/"
mapboxGeoCoderEndpoint = "geocoding/v5/mapbox.places/"
mapboxToken = "pk.eyJ1Ijoic2phbmkiLCJhIjoiY2tic2NvNGk2MDBiODJ4b3E3ajk4MmtuOSJ9.1FkGDgGkzek4mb8hHbsJGA"


# TODO GLOBAL - Error Handling, Transaction Management to be incuded wherever relevant
@app.route('/')
def homepage():
    """View homepage"""
    return render_template("homepage.html")

@app.route('/displaydatabychild')
def displaydatabychild():
    print("Showmap based on child")
    return

@app.route('/signup')
@app.route('/login')
def signup():
    """View SignUp"""
    print("In signup")
    return render_template("homepage.html")

@app.route('/api/parent/add', methods=['POST'])
def create_parent():
    print("Server.py: create parentfunction")
    
    query_str_data = request.get_json()
 
    print("Server.py: ", query_str_data)

    parent_fname = query_str_data['parentFname'],
    parent_lname = query_str_data['parentLname'],
    email = query_str_data['email'],
    phone = query_str_data['phone'],
    address1 = query_str_data['address1'], 
    address2 = query_str_data['address2'],
    city = query_str_data['city'], 
    state = query_str_data['resState'], 
    zipcode = query_str_data['zipcode'], 
    last_login = datetime.now(), 
    created_on = datetime.now(),
    password = query_str_data['password']

    print("Server.py: ", parent_fname)

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

    parent_info_dict = {"id" : parent_info.id, 
                    "parentFname" : parent_info.parent_fname,
                    "parentLname": parent_info.parent_lname,
                    "email" : parent_info.email,
                    "phone" : parent_info.phone,
                    "address1" : parent_info.address1,
                    "address2" : parent_info.address2,
                    "resState": parent_info.state,
                    "city" : parent_info.city,
                    "zipcode" : parent_info.zipcode,
                    "last_login" : parent_info.last_login}
    

    return jsonify(parent_info_dict)


@app.route('/api/parent/login', methods=['POST'])
def get_parent_by_email():

    query_str_data = request.get_json()
 
    print("In server.py - create child ", query_str_data)

    email = query_str_data['email']
    password = query_str_data['password']

    parent_info = crud.get_parent_by_email_pwd(email,password)
    if (parent_info == None):
        return jsonify("Invalid")
    print(f'*** In server.py get_parent_by_email, {parent_info.id}, {parent_info.parent_fname}')
    parent_info_dict = {"id" : parent_info.id, 
                    "parentFname" : parent_info.parent_fname,
                    "parentLname": parent_info.parent_lname,
                    "email" : parent_info.email,
                    "phone" : parent_info.phone,
                    "address1" : parent_info.address1,
                    "address2" : parent_info.address2,
                    "city" : parent_info.city,
                    "resState" : parent_info.state,
                    "zipcode" : parent_info.zipcode}

    return jsonify(parent_info_dict)

@app.route('/api/child/parent=<parent_id>')
def get_children_by_parent_id(parent_id):
    children = crud.get_children_by_parent_id(parent_id)
    print("*** In server.py get_children_by_parent_id, ", parent_id)

    children_dict = {}
    if (children != []):
        print("*** In server.py get_children_by_parent_id.. in if clause ") 
        
        for child in children:
            print("1. Looping")
            print("2 ", child)
            print("3" , child.id)
            print("4 ", child.child_fname)
            
            children_dict[child.id]= [child.id,
                            child.child_fname,
                            child.child_lname, 
                            child.grade, 
                            child.school_id, 
                            child.parent_id]

            print(children_dict)
    else:
        print(f'*** In server.py get_schools_in.. no schools fetched')

    return jsonify(children_dict)


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

# TODO - Implement proximity search based on zip code and not just an exact match by zip code as currently
@app.route('/api/schools/zipcode=<zip_code>')
def get_schools_in_near_zipcode(zip_code):
    schools = crud.get_schools_by_zipcode(zip_code)
    print("*** In server.py get_schools_in_near_zipcode.. ", schools)
    
    # print("*** In server.py get_schools_in_near_zipcode.. ", schools[0])
    school_dict = {}
    if (schools != []):
        print("*** In server.py get_schools_in_near_zipcode.. in if clause ") 
        
        for school in schools:
            print("1. Looping")
            print("2 ", school)
            print("3" , school.id)
            print("4 ", school.school_name)
            
            school_dict[school.id] = school.school_name
    else:
        print(f'*** In server.py get_schools_in.. no schools fetched')


    return jsonify(school_dict)

# Get a list of all open availabilities for a parent to see options to book rides for a given week
@app.route('/api/availability/parent_id=<parent_id>&school_id=<school_id>&week_start_date=<week_start_date>&open=1')
def get_open_availability_by_school(school_id, parent_id, week_start_date):
    openAvailabilitiesWithDriverInfo = crud.get_open_availability_by_school(school_id, parent_id, week_start_date)
    
    openAvailabilitiesWithDriverInfoDict = {}    
    openAvailabilitiesWithDriverInfoList = []
    if (openAvailabilitiesWithDriverInfo != []):
        print("*** In server.py get_open_availability_by_school.. in if clause ") 
        
        for openAvailabilityWithDriverInfo in openAvailabilitiesWithDriverInfo:
            ride_date = str(openAvailabilityWithDriverInfo.Availability.ride_date.strftime("%Y%m%d"))
            toSchoolFlag = openAvailabilityWithDriverInfo.Availability.to_school_flag
            parent_id = openAvailabilityWithDriverInfo.Parent.id
            availability_id = openAvailabilityWithDriverInfo.Availability.id
            available_spots = int(openAvailabilityWithDriverInfo.Availability.available_spots)
            parent_fname = openAvailabilityWithDriverInfo.Parent.parent_fname
            parent_lname = openAvailabilityWithDriverInfo.Parent.parent_lname

            # Fetch a list of all riders booked on this availability
            riders = crud.get_booked_rides_for_availability(availability_id)
            if (riders != ""):
                otherRiderList = []
                for rider in riders:
                    # Exclude current parent's child from the list of riders
                    if (rider.Parent.id != parent_id):
                        otherRiderList.append({'child_id': rider.Child.id,
                                    'child_fname': rider.Child.child_fname,
                                    'child_lname': rider.Child.child_lname,
                                    'parent_id': rider.Parent.id,
                                    'rider_address': rider.Parent.address1 + " " + rider.Parent.address2 + " " + rider.Parent.city + " "
                                                        + rider.Parent.state + " " + rider.Parent.zipcode,
                                    'booking_date': rider.Booked_Ride.booking_date.strftime("%a %m/%d %I:%M %p")
                                    })        


            if (ride_date in openAvailabilitiesWithDriverInfoDict):
                openAvailabilitiesWithDriverInfoList = openAvailabilitiesWithDriverInfoDict[ride_date]
            else:
                openAvailabilitiesWithDriverInfoList = []
            openAvailabilitiesWithDriverInfoList.append({'availability_id' : availability_id,
                                                        'available_spots' : available_spots,
                                                        'driver_id': parent_id,
                                                        'driver_fname': parent_fname,
                                                        'driver_lname': parent_lname,
                                                        'other_riders': otherRiderList})
            openAvailabilitiesWithDriverInfoDict[ride_date + "_" + str(toSchoolFlag)] = openAvailabilitiesWithDriverInfoList
        print("*** In server.py get_open_availability_by_school.. ", openAvailabilitiesWithDriverInfoDict)
    return jsonify(openAvailabilitiesWithDriverInfoDict)

# Get availability and riders booked for each availability for a parent, school & week start date Input - (ParentId, SchoolId, WeekStartDate), Output - (JSON Dictionary with Date&ToSchoolFlag - Availability details with Rider Info)
@app.route('/api/availability/parent_id=<parent_id>&school_id=<school_id>&week_start_date=<week_start_date>')
def get_availability_with_riders(parent_id, school_id, week_start_date):
    availabilities = crud.get_availability_by_school(parent_id, school_id, week_start_date)
    
    availabilityWithRidersDict = {}
    for availability in availabilities:
        availability_id = availability.id
        ride_date = str(availability.ride_date.strftime("%Y%m%d"))
        total_spots = int(availability.total_spots)
        available_spots = int(availability.available_spots)
        to_school_flag = availability.to_school_flag
        riders = crud.get_booked_rides_for_availability(availability_id)
        if (riders != ""):
            riderList = []
            for rider in riders:
                riderList.append({'child_id': rider.Child.id,
                                'child_fname': rider.Child.child_fname,
                                'child_lname': rider.Child.child_lname,
                                'parent_id': rider.Parent.id,
                                'rider_address': rider.Parent.address1 + " " + rider.Parent.address2 + " " + rider.Parent.city + " "
                                                    + rider.Parent.state + " " + rider.Parent.zipcode,
                                'booking_date': rider.Booked_Ride.booking_date.strftime("%a %m/%d %I:%M %p")
                                })

            availabilityWithRidersDict[ride_date + "_" + str(to_school_flag)] = {'availability_id': availability_id,
                                                                                'ride_date': ride_date,
                                                                                'to_school_flag': to_school_flag,
                                                                                'total_spots': total_spots,
                                                                                'available_spots': available_spots,
                                                                                'riders': riderList
                                                                                }
        
        print("*** In server.py get_availability_with_riders.. ", availabilityWithRidersDict)
    return jsonify(availabilityWithRidersDict)

# getMyBookedRideDetails - Input - (ParentId, SchoolId, WeekStartDate), Output - (JSON Dictionary with Date&ToSchoolFlag - Driver Parent Info)
@app.route('/api/bookedride/parent_id=<parent_id>&school_id=<school_id>&week_start_date=<week_start_date>')
def get_booked_rides_with_driver_info(parent_id, school_id, week_start_date):
    bookedRidesWithDriverInfo = crud.get_booked_rides_with_driver_info(parent_id, school_id, week_start_date)
    print("*** In server.py get_booked_rides_with_driver_info.. ", bookedRidesWithDriverInfo)
    bookedRidesWithDriverInfoDict = {}

    for bookedRideWithDriverInfo in bookedRidesWithDriverInfo:
        ride_date = str(bookedRideWithDriverInfo.Availability.ride_date.strftime("%Y%m%d"))
        toSchoolFlag = bookedRideWithDriverInfo.Availability.to_school_flag
        booking_id = bookedRideWithDriverInfo.Booked_Ride.id
        availability_id = bookedRideWithDriverInfo.Availability.id
        driver_id = bookedRideWithDriverInfo.Availability.parent_id
        driver_fname = bookedRideWithDriverInfo.Parent.parent_fname
        driver_lname = bookedRideWithDriverInfo.Parent.parent_lname
        driver_address = bookedRideWithDriverInfo.Parent.address1 + " " + bookedRideWithDriverInfo.Parent.address2 + " " \
                        + bookedRideWithDriverInfo.Parent.city + " " + bookedRideWithDriverInfo.Parent.state + " "\
                        + bookedRideWithDriverInfo.Parent.zipcode
        booking_date = bookedRideWithDriverInfo.Booked_Ride.booking_date

        bookedRidesWithDriverInfoDict[ride_date + "_" + str(toSchoolFlag)] = {'booking_id': booking_id,
                                                                        'driver_availability_id': availability_id,
                                                                        'driver_id' : driver_id,
                                                                        'driver_fname' : driver_fname,
                                                                        'driver_lname' : driver_lname,
                                                                        'driver_address': driver_address,
                                                                        'booking_date' : booking_date}
    return jsonify(bookedRidesWithDriverInfoDict)

# Get all addresses for a trip
@app.route('/api/availability/id=<availability_id>')
def get_addresses_for_trip(availability_id):
    availabilityDetails = crud.get_addresses_for_availability(availability_id)
    
    availabilityWithRiderDetailsDict = {}
    ride_date = availabilityDetails.Availability.ride_date.strftime("%a %m/%d")
    driver_name = availabilityDetails.Parent.parent_fname + " " + availabilityDetails.Parent.parent_lname
    driver_address = availabilityDetails.Parent.address1 + " " + availabilityDetails.Parent.address2 + " " + \
                    availabilityDetails.Parent.city + " " + availabilityDetails.Parent.state + " " + availabilityDetails.Parent.zipcode
    driver_long_lat = getLongitudeLatitudeForAddress(driver_address).get_json()
    school_name = availabilityDetails.School.school_name
    school_website = availabilityDetails.School.school_website
    school_address = availabilityDetails.School.address1 + " " + availabilityDetails.School.address2 + " " + \
                    availabilityDetails.School.city + " " + availabilityDetails.School.state + " " + availabilityDetails.School.zipcode
    school_long_lat = getLongitudeLatitudeForAddress(school_address).get_json()
    riders = crud.get_booked_rides_for_availability(availability_id)
    if (riders != ""):
        riderList = []
        for rider in riders:
            rider_address = rider.Parent.address1 + " " + rider.Parent.address2 + " " + rider.Parent.city + " "\
                                                + rider.Parent.state + " " + rider.Parent.zipcode
            riderList.append({'rider_id': rider.Child.id,
                            'rider_name': rider.Child.child_fname + " " + rider.Child.child_lname,
                            'rider_address': rider_address,
                            'rider_long_lat' : getLongitudeLatitudeForAddress(rider_address).get_json()})

        availabilityWithRiderDetailsDict = {'driver_name': driver_name,
                                            'driver_address': driver_address,
                                            'driver_long_lat': driver_long_lat,
                                            'ride_date': ride_date,
                                            'school_name': school_name,
                                            'school_website': school_website,
                                            'school_address': school_address,
                                            'school_long_lat': school_long_lat,
                                            'riders': riderList
                                            }
        
    print("*** In server.py get_addresses_for_trip.. ", availabilityWithRiderDetailsDict)
    return jsonify(availabilityWithRiderDetailsDict)

# Add new availability for parent for a given date and route
@app.route('/api/availability/add', methods=['POST'])
def create_availability():
    print("In server.py create availability function")
    
    query_str_data = request.get_json()
 
    print("In server.py - create availability", query_str_data, type(query_str_data))

    total_spots = 3     # TODO - Defaulted to 3 for now. Will provide functionality for capturing this from parent info later
    available_spots = 3     # TODO - Defaulted to 3 for now. Will provide functionality for capturing this from parent info later

    parent_id = query_str_data['parentId']
    school_id = query_str_data['schoolId']
    ride_date = datetime.strptime(query_str_data['rideDate'], '%Y%m%d')
    to_school_flag = query_str_data['toSchoolFlag']

    try:
        result = crud.create_availability(parent_id, school_id, total_spots, available_spots, ride_date, to_school_flag)
    except:
        result = "Error inserting availability"
    return jsonify(result)

# Update existing availability for given availability id
@app.route('/api/availability/id=<availability_id>', methods=['PUT'])
def update_availability(availability_id):
    print("In server.py update availability function")
    
    query_str_data = request.get_json()
 
    print("In server.py - update availability", query_str_data, type(query_str_data))

    available_spots = query_str_data['availableSpots']

    try:
        crud.update_availability(availability_id, available_spots)
        result = "Availability updated successfully"
    except:
        result = "Error updating availability"
    return jsonify(result)

# Delete existing availability for given availability id
@app.route('/api/availability/id=<availability_id>', methods=['DELETE'])
def delete_availability(availability_id):
    print("In server.py delete availability function")

    try:
        result = crud.delete_availability(availability_id)
    except:
        result = "Error updating availability"
    return jsonify(result)

@app.route('/api/booking/add', methods=['POST'])
def create_booked_ride():
    print("In server.py create booked_ride function")
    
    query_str_data = request.get_json()
 
    print("In server.py - create booked_ride", query_str_data, type(query_str_data))
    print("In server.py - create booked_ride booking date", datetime.now())

    availability_id = query_str_data['driverAvailabilityId']
    parent_id = query_str_data['parentId']
    child_id = query_str_data['childId']
    booking_date = datetime.now()

    try:
        result = crud.create_booked_ride(availability_id, parent_id, child_id, booking_date)
        return jsonify(result.id)
    except:
        result = "Error inserting booked_ride"
        return result
    

# Delete existing booked_ride for given booking id
@app.route('/api/booking/id=<booking_id>', methods=['DELETE'])
def delete_booked_ride(booking_id):
    print("In server.py delete booked_ride function")

    try:
        result = crud.delete_booked_ride(booking_id)
    except:
        result = "Error updating booked_ride"
    return jsonify(result)

# TODO - Use method if interface changes to provide 10 checkboxes for parent to specify their availability
@app.route('/api/availability/addweek', methods=['POST'])
def create_availability_for_week():
    print("In server.py create availability for week function")
    
    query_str_data = request.get_json()
 
    print("In server.py - create availability for week ", query_str_data, type(query_str_data))

    availability_list = []
    total_spots = 3     # TODO - Defaulted to 3 for now. Will provide functionality for capturing this from parent info later
    available_spots = 3     # TODO - Defaulted to 3 for now. Will provide functionality for capturing this from parent info later

    parent_id = query_str_data['parentId']
    school_id = query_str_data['schoolId']
    monday_date = datetime.strptime(query_str_data['mondayDate'], '%Y-%m-%d')

    for param, param_value in query_str_data.items():
        print(f'{param} : {param_value}')
 
        if "drive_" in param and param_value:
            print ("In the if clause..")
            days_since_monday = int(param[-1])

            ride_date = monday_date + timedelta(days=days_since_monday)
            print(ride_date)
            to_school_flag = True if ("to" in param) else False
         
            try:
                result = crud.create_availability(parent_id, school_id, total_spots, available_spots, ride_date, to_school_flag)
            except:
                result = "Error inserting availability"
        availability_list.append(result)
    return jsonify(availability_list)

# TODO - Get longitude & latitude for addresses using Mapbox Forward Geocoding API
@app.route('/api/map/location/address=<address>', methods=['GET'])
def getLongitudeLatitudeForAddress(address):
    print("In server.py getLongitudeLatitudeForAddress function", address)
    
    # Call the Mapbox Forward Geocoding API to get the longitude & latitude for an address
    r = requests.get(mapboxBaseUrl + mapboxGeoCoderEndpoint + address + ".json?types=address&access_token=" + mapboxToken)
    r.text

    coordinates = []
    # Convert it to a Python dictionary
    data = json.loads(r.text)
    if (data != ""):
        features = data['features']
        if (features != ""):
            coordinates = features[0]['geometry']['coordinates']

    # TODO - Use the Mapbox Forward Geocoding API
    return jsonify(coordinates)


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
    