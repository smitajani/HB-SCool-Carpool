
//TODO - Include Parent Avatar (Picture/Initials) with ratings & number of rides taken with the parent by your child
class RideOptions extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorMessage: "",
            rideDate: this.props.rideDate,
            toSchoolFlag: this.props.toSchoolFlag,
            parentId: this.props.parentId,
            schoolId: this.props.schoolId,
            childId: this.props.childId,
            availabilitiesWithRiderInfo: this.props.availabilitiesWithRiderInfo,
            openAvailabilitiesWithDriverInfo: this.props.openAvailabilitiesWithDriverInfo,
            bookedRidesWithDriverInfo: this.props.bookedRidesWithDriverInfo,
            origSelOption: "N",
            selOption: "N",
            availabilityId: "-1",
            availableSpots: 0,
            spotsTaken: 0,
            origDriverAvailabilityId: "-1",
            driverAvailabilityId: "-1",
            bookingId: "-1"
        };
        this.handleChange = this.handleChange.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.addAvailability = this.addAvailability.bind(this)
        this.updateAvailability = this.updateAvailability.bind(this)
        this.deleteAvailability = this.deleteAvailability.bind(this)
        this.addBooking = this.addBooking.bind(this)
        this.deleteBooking = this.deleteBooking.bind(this)
        this.getAvailableSpotsForDriver = this.getAvailableSpotsForDriver.bind(this)
    }

    componentDidMount() {
        console.log("this.props.rideDate _ this.props.toSchoolFlag : " + this.props.rideDate + "_" + this.props.toSchoolFlag)
        //If parent is opted to drive on this day & route previously
        if (this.props.availabilitiesWithRiderInfo[this.props.rideDate + "_" + this.props.toSchoolFlag] != undefined) { 
            this.setState({origSelOption: "D",
                            selOption: "D",
                            availabilityId: this.props.availabilitiesWithRiderInfo[this.props.rideDate + "_" + this.props.toSchoolFlag].availability_id,
                            availableSpots: parseInt(this.props.availabilitiesWithRiderInfo[this.props.rideDate + "_" + this.props.toSchoolFlag].available_spots),
                            spotsTaken: parseInt(this.props.availabilitiesWithRiderInfo[this.props.rideDate + "_" + this.props.toSchoolFlag].total_spots) - this.state.availableSpots});

        }
        //If parent has booked a ride on this day & route previously
        else if (this.props.bookedRidesWithDriverInfo[this.props.rideDate + "_" + this.props.toSchoolFlag] != undefined) {
            this.setState({origSelOption: "R",
                            selOption: "R",
                            bookingId: this.props.bookedRidesWithDriverInfo[this.props.rideDate + "_" + this.props.toSchoolFlag].booking_id,
                            origDriverAvailabilityId: this.props.bookedRidesWithDriverInfo[this.props.rideDate + "_" + this.props.toSchoolFlag].driver_availability_id,
                            driverAvailabilityId: this.props.bookedRidesWithDriverInfo[this.props.rideDate + "_" + this.props.toSchoolFlag].driver_availability_id
                        });
        }
    }

    //Handle Change event 
    handleChange = event => {
        this.setState({ [event.target.name] : event.target.value})
        }
    
    handleInputChange(event) {
        const target = event.target;
    //    const value = target.name === 'isGoing' ? target.checked : target.value;
        const name = target.name;
        const value = target.value;
        const checkedState = target.checked;
    
        this.setState({
            name: checkedState,
            selOption: value
          });
    }

    //TODO - Do checks right before save to ensure no other parent has booked rides from the time current parent loaded screen info
    handleSubmit(event) {
        event.preventDefault();
        const {selOption, origSelOption, availabilityId, bookingId, rideDate, toSchoolFlag,
                origDriverAvailabilityId, driverAvailabilityId} = this.state;
        console.log("Inside RideOptions handleSubmit : ",rideDate,toSchoolFlag,selOption, origSelOption,availabilityId, bookingId )

        // Do nothing if user selection of Drive / None has not changed OR Ride without any driver change
        if ((selOption == origSelOption && (selOption == "D" || selOption == "N")) 
            || ((origSelOption == "R" && selOption == "R") && origDriverAvailabilityId == driverAvailabilityId)) {
            this.setState({errorMessage: "No changes to save"});
            return;
        }
        else {
            //If original selection was Drive
            if (origSelOption == "D") {
                // If other parents had already booked rides, do not allow parent to change availability
                //TODO - In future, allow them to change after notifying parents & have some way to track how many times parents change & how much in advance they change their availability to drive
                if (spotsTaken > 0) {
                    this.setState({errorMessage: "There are already riders. Cannot change now"});
                    return;
                }
                else {
                    //TODO CODE - Delete existing availability to drive since parent has now changed to something else (Ride / None)
                    this.deleteAvailability()
                    
                    //TODO CODE Parent has decided to book a ride & this booking needs to be saved
                    if (selOption == "R") {
                        this.addBooking()
                        this.updateAvailability(driverAvailabilityId, this.getAvailableSpotsForDriver(driverAvailabilityId) - 1)
                    }
                }
            }
            //If original selection was Ride
            else if (origSelOption == "R") {
                //TODO CODE - Delete booking since parent has decided to drive or not ride now
                this.deleteBooking()
                this.updateAvailability(origDriverAvailabilityId, this.getAvailableSpotsForDriver(origDriverAvailabilityId) + 1)
                
                if (selOption == "D") {
                    //TODO CODE - Save new availability in the db
                    this.addAvailability()
                }
                else if (selOption == "R") {
                    this.addBooking()
                    this.updateAvailability(driverAvailabilityId, this.getAvailableSpotsForDriver(driverAvailabilityId) - 1)
                }

            }
            //If original selection was None
            else {
                //If new selection is to Drive, add availability 
                if (selOption == "D") {
                    this.addAvailability()
                }
                //If new selection is to Ride, book the ride
                else {
                    this.addBooking()
                    this.updateAvailability(driverAvailabilityId, this.getAvailableSpotsForDriver(driverAvailabilityId) - 1)
                }
            }
        }
        //TOD CODE If all records are saved successfully, reset origSelOption as well as other state variables based on just saved values so that any subsequent save actions will work properly
    }

    //Used to find the current available spots for driving parent's availability for a driver selected by current parent when they choose the Ride option
    getAvailableSpotsForDriver(driverAvailabilityId) {
        const { rideDate, toSchoolFlag, openAvailabilitiesWithDriverInfo} = this.state
        console.log("Inside getAvailableSpotsForDriver : " + driverAvailabilityId, rideDate, toSchoolFlag, openAvailabilitiesWithDriverInfo)
        
        const openAvailabilitiesForRideDate = openAvailabilitiesWithDriverInfo[rideDate + "_" + toSchoolFlag]

        if (openAvailabilitiesForRideDate != undefined) {
            for (const routeAvailability of openAvailabilitiesForRideDate) {
                console.log("routeAvailability availability id : " + routeAvailability.availability_id)
                if (routeAvailability.availability_id == driverAvailabilityId)
                    return parseInt(routeAvailability.available_spots)
            }
        }
        return 0
    }

    //Used to add availability for current parent when those choose the Drive option for a route
    addAvailability() {
        const {parentId, schoolId, rideDate, toSchoolFlag} = this.state;
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parentId, schoolId, rideDate, toSchoolFlag})
        }

        console.log("RideOptions - addAvailability", requestOptions, "--")
        fetch('/api/availability/add', requestOptions)
        .then(res => res.json())
        .then(data => {
            alert("You've added your availability details successfully")
            console.log(data)
            this.setState({availabilityId: data.id})
        });
    }

    //Used to update available spots for driving parent's availability when current parent books a ride
    updateAvailability(availabilityId, availableSpots) {
        console.log("In updateAvailability : " + availabilityId + ":" + availableSpots)

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ availableSpots })
        }

        console.log("RideOptions - updateAvailability", requestOptions, "--")
        fetch(`/api/availability/id=${availabilityId}`, requestOptions)
        .then(res => res.json())
        .then(data => {
            alert("You've updated your availability details successfully")
            console.log(data)
            this.setState({origDriverAvailabilityId: availabilityId,
                            driverAvailabilityId: availabilityId})
        });
    }

    //Used to delete current parent availability for a route when they select Ride / None option instead of the earlier Drive option
    deleteAvailability() {
        const { availabilityId } = this.state
        console.log("In deleteAvailability : " + availabilityId)

        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }

        console.log("RideOptions - deleteAvailability", requestOptions, "--")
        fetch(`/api/availability/id=${availability_id}`, requestOptions)
        .then(res => res.json())
        .then(data => {
            alert("You've deleted your availability details successfully")
            console.log(data)
            this.setState({availabilityId: ""})
        });
    }    

    //Used when the current parent chooses to book a new ride
    addBooking() {
        const { driverAvailabilityId, parentId, childId } = this.state;
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ driverAvailabilityId, parentId, childId})
        }

        console.log("RideOptions - addBooking", requestOptions, "--")
        fetch('/api/booking/add', requestOptions)
        .then(res => res.json())
        .then(data => {
            alert("You've added your ride booking details successfully")
            console.log(data)
            this.setState({bookingId: data.id,
                        origDriverAvailabilityId: driverAvailabilityId})
        });
    }

    //Used to delete a previously booked ride by the current parent
    deleteBooking() {
        const {bookingId } = this.state

        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }

        console.log("RideOptions - deleteBooking", requestOptions, "--")
        fetch(`/api/booking/id=${booking_id}`, requestOptions)
        .then(res => res.json())
        .then(data => {
            alert("You've deleted your booking details successfully")
            console.log(data)
            this.setState({bookingId: ""})
        });
    }        

    render() {
        const {selOption} = this.state;
        console.log("selOption : " + selOption);
        // console.log("Selected Option in RideOptions Render: " + {[this.state + "selectedOption_" + this.state.rideDate + "_" + this.state.toSchoolFlag]});

        const driverParentOptions = [];
        const openAvailabilitiesForRideDate = this.state.openAvailabilitiesWithDriverInfo[this.props.rideDate + "_" + this.props.toSchoolFlag];

        console.log("openAvailabilitiesForRideDate : " + this.state.rideDate + " : " + this.state.toSchoolFlag + ":" + openAvailabilitiesForRideDate)
        if (openAvailabilitiesForRideDate != undefined) {
            for (const openAvailability of openAvailabilitiesForRideDate) {
                driverParentOptions.push(
                    <option value={openAvailability.availability_id}>
                        {openAvailability.driver_fname} {openAvailability.driver_lname} (Available Spots : {openAvailability.available_spots})
                    </option>
                )
            }
        }

        const riders = [];
        if (this.state.origSelOption == "D") {
            const myAvailability = this.state.openAvailabilitiesWithDriverInfo[this.props.rideDate + "_" + this.props.toSchoolFlag];
            if (myAvailability != undefined) {
                const riders = myAvailability.riders
                if (riders != undefined) {
                    for (const rider of riders) {
                        riders.push(
                            <p class="font-weight-light">
                                {rider.child_fname} {rider.child_lname} (Booked : {rider.booking_date})
                            </p>
                        )
                    }
                }
            }
        }

        return(
            <div class="container">
                <div class="card">
                    <div class="card-body">
                        {this.state.errorMessage != ""?
                        <div role="alert" class="alert alert-danger" id={["err_" + this.props.rideDate + "_" + this.props.toSchoolFlag]}>
                            {this.state.errorMessage}
                        </div>
                        :<div></div>}
                        <form onSubmit={this.handleSubmit}>
                            <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                    <label class={(selOption === "D") ? "btn btn-light active" : "btn btn-light"}>
                                        <input type="radio" value="D" name={["poolOptions_" + this.props.rideDate + "_" + this.props.toSchoolFlag]} 
                                        checked={selOption === 'D'} onChange={this.handleInputChange} onClick={this.handleInputChange} /> Drive
                                    </label>
                                    <label class={(selOption === "R") ? "btn btn-light active" : "btn btn-light"}>
                                        <input type="radio" value="R" name={["poolOptions_" + this.props.rideDate + "_" + this.props.toSchoolFlag]} 
                                        checked={selOption === 'R'} onChange={this.handleInputChange} onClick={this.handleInputChange} /> Ride
                                    </label>
                                    <label class={(selOption === "N") ? "btn btn-light active" : "btn btn-light"}>
                                        <input type="radio" value="N" name={["poolOptions_" + this.props.rideDate + "_" + this.props.toSchoolFlag]} 
                                        checked={selOption === 'N'} onChange={this.handleInputChange} onClick={this.handleInputChange} /> None
                                    </label>
                                </div>
                                <br /><br />
                                {(selOption === "D") ? 
                                <div class="container">
                                    <label>Available Spots: {this.state.availableSpots}</label>
                                    Riders <br />
                                    {riders}
                                </div>
                                :
                                <div></div>}
                                {(selOption === "R") ? 
                                <div>
                                {/* <div class="dropdown">
                                    <button class="btn btn-primary-outline dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Select a ride
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <a class="dropdown-item" onChange={this.handleRideChange} href="#" value="1" id="1">John Martin</a>
                                        <a class="dropdown-item" onChange={this.handleRideChange} href="#" value="2" id="2">Jane Smith</a>
                                        <a class="dropdown-item" onChange={this.handleRideChange} href="#" value="3" id="3">Something else here</a>
                                    </div>
                                </div> */}
                                <label>Driving Parent</label>
                                <select value={this.state.driverAvailabilityId} name="driverAvailabilityId" onChange={this.handleChange}>
                                    <option value="-1">Select driver</option>
                                    {driverParentOptions}
                                </select> 
                            </div>
                            : 
                            <div></div>}
                            <button id={["save_" + this.props.rideDate + "_" + this.props.toSchoolFlag]}>
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            </div>    
        );
    }
}