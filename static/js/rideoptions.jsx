
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
        this.handleMapClick = this.handleMapClick.bind(this)
    }

    handleMapClick(event) {
        event.preventDefault();
        const { selOption } = this.state
        if (selOption == "D") {
            this.props.handleMapClick(this.state.availabilityId)
        }
        else if (selOption == "R")
            this.props.handleMapClick(this.state.driverAvailabilityId)
        else
        this.props.handleMapClick("-1")
    }

    componentDidMount() {
        // console.log("this.props.rideDate _ this.props.toSchoolFlag : " + this.props.rideDate + "_" + this.props.toSchoolFlag)
        //If parent is opted to drive on this day & route previously
        if (this.props.availabilitiesWithRiderInfo[this.props.rideDate + "_" + this.props.toSchoolFlag] != undefined) { 
            console.log("My Availability : " + this.props.availabilitiesWithRiderInfo[this.props.rideDate + "_" + this.props.toSchoolFlag])
            this.setState({origSelOption: "D",
                            selOption: "D",
                            availabilityId: this.props.availabilitiesWithRiderInfo[this.props.rideDate + "_" + this.props.toSchoolFlag].availability_id,
                            availableSpots: parseInt(this.props.availabilitiesWithRiderInfo[this.props.rideDate + "_" + this.props.toSchoolFlag].available_spots),
                            spotsTaken: parseInt(this.props.availabilitiesWithRiderInfo[this.props.rideDate + "_" + this.props.toSchoolFlag].total_spots) - 
                                        parseInt(this.props.availabilitiesWithRiderInfo[this.props.rideDate + "_" + this.props.toSchoolFlag].available_spots)});

        }
        //If parent has booked a ride on this day & route previously
        else if (this.props.bookedRidesWithDriverInfo[this.props.rideDate + "_" + this.props.toSchoolFlag] != undefined) {
            console.log("My Booked Ride : " + this.props.bookedRidesWithDriverInfo[this.props.rideDate + "_" + this.props.toSchoolFlag])
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
        // if (event.target.name == 'driverAvailabilityId') {
        //     this.setState({otherRiders}) = 
        // }
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

    getDateKeyForCurrentDate() 
    {
        const selectedWeekStartDate = this.state.selWeekStartDate
        var currentDate = new Date();
        var yearNo = currentDate.getFullYear();
        var dateNo = currentDate.getDate();
        var monthNo = currentDate.getMonth() + 1;
        var dateKey = yearNo + "" + (monthNo < 10?"0" + monthNo:monthNo) + "" + (dateNo < 10?"0" + dateNo:dateNo);
        return (dateKey);
    }    

    //TODO - Do checks right before save to ensure no other parent has booked rides from the time current parent loaded screen info
    handleSubmit(event) {
        event.preventDefault();
        const {selOption, origSelOption, availabilityId, bookingId, rideDate, toSchoolFlag,
                origDriverAvailabilityId, driverAvailabilityId} = this.state;
        console.log("Inside RideOptions handleSubmit : ",rideDate,toSchoolFlag,selOption, origSelOption,availabilityId, bookingId )

        if (rideDate < this.getDateKeyForCurrentDate()) {
            this.setState({errorMessage: "Cannot make any changes for past days"});
            return;
        }

        //TODO - This entire logic needs to be moved to the backend

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
                if (this.state.spotsTaken > 0) {
                    this.setState({errorMessage: "There are already " + this.state.spotsTaken + " riders. Cannot change now"});
                    return;
                }
                else {
                    //Delete existing availability to drive since parent has now changed to something else (Ride / None)
                    this.deleteAvailability()
                    
                    //Parent has decided to book a ride & this booking needs to be saved
                    if (selOption == "R") {
                        this.addBooking()
                        this.updateAvailability(driverAvailabilityId, this.getAvailableSpotsForDriver(driverAvailabilityId) - 1)
                        this.setState({origSelOption: "R",
                                        origDriverAvailabilityId: driverAvailabilityId})
                    }
                    else {
                        this.setState({origSelOption: "N"})
                    }
                }
            }
            //If original selection was Ride
            else if (origSelOption == "R") {
                //Delete booking since parent has decided to drive or not ride now
                this.deleteBooking()
                this.updateAvailability(origDriverAvailabilityId, this.getAvailableSpotsForDriver(origDriverAvailabilityId) + 1)
                
                if (selOption == "D") {
                    //Save new availability in the db
                    this.addAvailability()
                    this.setState({origDriverAvailabilityId: "-1",
                                    driverAvailabilityId:"-1"})

                }
                else if (selOption == "R") {
                    this.addBooking()
                    this.updateAvailability(driverAvailabilityId, this.getAvailableSpotsForDriver(driverAvailabilityId) - 1)
                    this.setState({origSelOption: "R",
                                    origDriverAvailabilityId: driverAvailabilityId})

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
                    this.setState({origSelOption: "R",
                                    origDriverAvailabilityId: driverAvailabilityId})
                }
            }
        }
    }

    //Used to find the current available spots for driving parent's availability for a driver selected by current parent when they choose the Ride option
    getAvailableSpotsForDriver(driverAvailabilityId) {
        console.log("Inside getAvailableSpotsForDriver : " + driverAvailabilityId, this.props.rideDate, this.props.toSchoolFlag, this.props.openAvailabilitiesWithDriverInfo)
        
        const openAvailabilitiesForRideDate = this.props.openAvailabilitiesWithDriverInfo[this.props.rideDate + "_" + this.props.toSchoolFlag]

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
            this.setState({availabilityId: data.id,
                            origSelOption: "D",
                            origDriverAvailabilityId: "-1",
                            driverAvailabilityId: "-1",
                            bookingId: "-1",
                            availableSpots: data.available_spots,
                            spotsTaken: data.total_spots - data.available_spots})
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
        fetch(`/api/availability/id=${availabilityId}`, requestOptions)
        .then(res => res.json())
        .then(data => {
            alert("You've deleted your availability details successfully")
            console.log(data)
            this.setState({availabilityId: "",
                            availableSpots: 0,
                            spotsTaken: 0})
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
        fetch(`/api/booking/id=${bookingId}`, requestOptions)
        .then(res => res.json())
        .then(data => {
            alert("You've deleted your booking details successfully")
            console.log(data)
            this.setState({bookingId: "-1"})
        });
    }        

    render() {
        const {selOption} = this.state;
        console.log("selOption : " + selOption);
        // console.log("Selected Option in RideOptions Render: " + {[this.state + "selectedOption_" + this.state.rideDate + "_" + this.state.toSchoolFlag]});

        const riders = [];
        let ridersList = [];

        if (this.state.origSelOption == "D") {
            const myAvailability = this.props.availabilitiesWithRiderInfo[this.props.rideDate + "_" + this.props.toSchoolFlag];
            console.log("myAvailabilityWithRiderInfo : " + this.state.rideDate + " : " + this.state.toSchoolFlag + ":" + myAvailability)
            if (myAvailability != undefined) {
                ridersList = myAvailability.riders
            }
        }

        const driverParentOptions = [];
        const openAvailabilitiesForRideDate = this.props.openAvailabilitiesWithDriverInfo[this.props.rideDate + "_" + this.props.toSchoolFlag];

        console.log("RideOptions render - openAvailabilitiesForRideDate : " + this.props.rideDate + " : " + this.props.toSchoolFlag + ":" + openAvailabilitiesForRideDate)
        if (openAvailabilitiesForRideDate != undefined) {
            for (const openAvailability of openAvailabilitiesForRideDate) {
                driverParentOptions.push(
                    <option value={openAvailability.availability_id}>
                        {openAvailability.driver_fname} {openAvailability.driver_lname} (Available Spots : {openAvailability.available_spots})
                    </option>
                    )
                if (this.state.selOption == "R" && openAvailability.availability_id == this.state.driverAvailabilityId) {
                    ridersList = openAvailability.other_riders;
                }
            }
        }

        if (ridersList != undefined) {
            for (const rider of ridersList) {
                console.log("Rider name : " + rider.child_fname + " " + rider.child_lname)
                riders.push(
                    <tr>
                        <td>
                        <div class="circle">
                            <span class="initials">{rider.child_fname.substring(0,1)}{rider.child_lname.substring(0,1)}</span>
                        </div>
                        </td>
                        <td>{rider.child_fname} {rider.child_lname}<br />(Booked : {rider.booking_date})</td>
                    </tr>
                )
            }
        }

        let cardStyle = "card rideOptionsCard";
        if (selOption == "D")
            cardStyle = "card rideOptionsCard driverCard"
        else if (selOption == "R")
            cardStyle = "card rideOptionsCard riderCard";;

        return(
            <div class="container">
                <div class={cardStyle}>
                    <div class="card-body rideOptionsCardBody">
                        {this.state.errorMessage != ""?
                        <div role="alert" class="alert alert-danger" id={["err_" + this.props.rideDate + "_" + this.props.toSchoolFlag]}>
                              <button type="button" class="close" data-dismiss="alert">x</button>
                            {this.state.errorMessage}
                        </div>
                        :<div></div>}
                        <form>
                            <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                    <label class={(selOption === "D") ? "btn btn-light active mybasefont" : "btn btn-light mybasefont"}>
                                        <input type="radio" value="D" name={["poolOptions_" + this.props.rideDate + "_" + this.props.toSchoolFlag]} 
                                        checked={selOption === 'D'} onChange={this.handleInputChange} onClick={this.handleInputChange} /> Drive
                                    </label>
                                    <label class={(selOption === "R") ? "btn btn-light active mybasefont" : "btn btn-light mybasefont"}>
                                        <input type="radio" value="R" name={["poolOptions_" + this.props.rideDate + "_" + this.props.toSchoolFlag]} 
                                        checked={selOption === 'R'} onChange={this.handleInputChange} onClick={this.handleInputChange} /> Ride
                                    </label>
                                    <label class={(selOption === "N") ? "btn btn-light active mybasefont" : "btn btn-light mybasefont"}>
                                        <input type="radio" value="N" name={["poolOptions_" + this.props.rideDate + "_" + this.props.toSchoolFlag]} 
                                        checked={selOption === 'N'} onChange={this.handleInputChange} onClick={this.handleInputChange} /> None
                                    </label>
                                </div>
                                <br /><br />
                                {(selOption === "D") ? 
                                <div>
                                    <label>Available Spots: {this.state.availableSpots}</label>
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
                                <label class="mybasefont">Driving Parent</label>
                                <select class="custom-select-dd" value={this.state.driverAvailabilityId} name="driverAvailabilityId" onChange={this.handleChange}>
                                    <option value="-1">Select driver</option>
                                    {driverParentOptions}
                                </select>
                            </div>
                            : 
                            <div></div>}
                            {((selOption == "D" && this.state.availabilityId != "-1") || (selOption == "R" && this.state.driverAvailabilityId != "-1")) ?     
                                    <div>
                                    <br /><b>Riders</b> <br />
                                    <table>
                                        <tbody>
                                            {riders}
                                        </tbody>
                                    </table>
                                <div class="righttopcorner">
                                    <button id={["map_" + this.props.rideDate + "_" + this.props.toSchoolFlag]} class="btn btn-link" onClick={this.handleMapClick}>
                                        <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-map" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M15.817.613A.5.5 0 0 1 16 1v13a.5.5 0 0 1-.402.49l-5 1a.502.502 0 0 1-.196 0L5.5 14.51l-4.902.98A.5.5 0 0 1 0 15V2a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0l4.902.98 4.902-.98a.5.5 0 0 1 .415.103zM10 2.41l-4-.8v11.98l4 .8V2.41zm1 11.98l4-.8V1.61l-4 .8v11.98zm-6-.8V1.61l-4 .8v11.98l4-.8z"/>
                                        </svg>
                                    </button>
                                    </div>
                                    </div>
                                :""}              
                            <div class="rightbottomcorner">
                                <button id={["save_" + this.props.rideDate + "_" + this.props.toSchoolFlag]} class="btn btn-link" onClick={this.handleSubmit}>
                                    {selOption == "N" ? 
                                    <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-calendar-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                        <path fill-rule="evenodd" d="M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1zm1-3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"/>
                                        <path fill-rule="evenodd" d="M3.5 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zm9 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5z"/>
                                    </svg>
                                    :
                                    <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-calendar-check-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM0 5h16v9a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5zm10.854 3.854a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
                                    </svg>
                                    }
                                    </button>
                            </div>
                        </form>
                        {/* <ShowMap key={["map_" + this.props.rideDate + "_" + this.props.toSchoolFlag]} /> */}
                        {/* <button type="button" class="btn btn-primary" data-toggle="modal" 
                            data-target="#mapModal">Map</button> */}
                    </div>
                </div>
            </div>    
        );
    }
}