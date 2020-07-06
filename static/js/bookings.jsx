//TODO Move all children information from ParentInfo into ChildInfo class. Will have to ensure some state variables for child details in ParentInfo are maintained to control display of Bookings
// TODO CODE - Include Previous / Next Week buttons to navigate across different weeks.
class Bookings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            parentId: this.props.parentId,
            schoolId: this.props.schoolId,
            childId: this.props.childId,
            weekStartDate: this.getWeekStartDate(new Date()),
            weekStartDateKey: this.getDateKeyForWeekDay(0, true),
            availabilitiesWithRiderInfo : {},
            openAvailabilitiesWithDriverInfo : {},
            bookedRidesWithDriverInfo : {},
            allDataInitialized: false,
            errorMessage: "",
        };
        console.log("Bookings.jsx Constructor - weekStartDate : " + this.state.weekStartDate & " & weekStartDateKey : " + this.state.weekStartDateKey)

        this.handleChange = this.handleChange.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleMapClick = this.handleMapClick.bind(this)
        this.changeWeek = this.changeWeek.bind(this)

        this.getAllAvailabilitiesAndBookedRides();
    }

    handleMapClick(availabilityId) {
        // console.log("In bookings handleMapClick : " + availabilityId)
        this.props.handleMapClick(availabilityId)
    }

    changeWeek(event) {
        event.preventDefault();
        let selectedWeekStartDate = this.state.weekStartDate;
        if (event.target.name == "P")
            selectedWeekStartDate.setDate(selectedWeekStartDate.getDate() - 7);
        else
            selectedWeekStartDate.setDate(selectedWeekStartDate.getDate() + 7);

        var yearNo = selectedWeekStartDate.getFullYear();
        var dateNo = selectedWeekStartDate.getDate();
        var monthNo = selectedWeekStartDate.getMonth()+1;
        var selectedWeekStartDateKey = yearNo + "" + (monthNo < 10?"0" + monthNo:monthNo) + "" + (dateNo < 10?"0" + dateNo:dateNo);

        console.log("changeWeek - weekStartDate, Selected Week Start Date & selectedWeekStartDateKey : " + this.state.weekStartDate + ":" + selectedWeekStartDate + ":" + selectedWeekStartDateKey)
        this.setState({ weekStartDate: selectedWeekStartDate,
                        weekStartDateKey: selectedWeekStartDateKey,
                        allDataInitialized: false});
        this.getAllAvailabilitiesAndBookedRides();
    }

    getWeekStartDate(d) {
        d = new Date(d);
        var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        var mondayDate = new Date(d.setDate(diff));
        return mondayDate;
    }

    getDateStrForWeekDay(offset) 
    {
        // const selectedWeekStartDate = this.props.weekStartDate ? this.props.weekStartDate : this.getWeekStartDate(new Date())
        // console.log("INside gateDateStrForWeekDay selectedWeekStartDate : " + selectedWeekStartDate)
        const selectedWeekStartDate = this.state.weekStartDate
        var offsetDate = new Date(selectedWeekStartDate);
        offsetDate.setDate(selectedWeekStartDate.getDate()+offset);
        var dateNo = offsetDate.getDate();
        var monthNo = offsetDate.getMonth()+1;
        var dateStrforWeekDay = (monthNo < 10?("0" + monthNo):monthNo) + "/" + (dateNo < 10?("0" + dateNo):dateNo);
        console.log("getDateStrForWeekDay - weekStartDate, Selected Week Start Date & dateStrforWeekDay : " + this.state.weekStartDate + ":" + selectedWeekStartDate + ":" + dateStrforWeekDay);

         return (dateStrforWeekDay);
    }

    getDateKeyForWeekDay(offset, currentWeek) 
    {
        const selectedWeekStartDate = currentWeek ? this.getWeekStartDate(new Date()) : this.state.weekStartDate;
        var offsetDate = new Date(selectedWeekStartDate);
        offsetDate.setDate(selectedWeekStartDate.getDate()+offset);
        var yearNo = offsetDate.getFullYear();
        var dateNo = offsetDate.getDate();
        var monthNo = offsetDate.getMonth()+1;
        var dateKey = yearNo + "" + (monthNo < 10?"0" + monthNo:monthNo) + "" + (dateNo < 10?"0" + dateNo:dateNo);
        console.log("getDateKeyForWeekDay - Selected Week Start Date & dateKey : " + selectedWeekStartDate + ":" + dateKey)
         return (dateKey);
    }

    async getAllAvailabilitiesAndBookedRides() {
        console.log("getAllAvailabilitiesAndBookedRides weekStartDate & weekStartDateKey : " + this.state.weekStartDate + ":" + this.state.weekStartDateKey)

        //Fetch current parent availability with rides booked by other parents
        let availabilityResponse = await fetch(`/api/availability/parent_id=${this.state.parentId}&school_id=${this.state.schoolId}&week_start_date=${this.state.weekStartDateKey}`)
            .then(async availabilityResponse => await availabilityResponse.json())
            .then(data => {
                this.setState({ availabilitiesWithRiderInfo: data })
            })

        //Fetch current parent booked rides with driver info for those rides
        let bookedRideResponse = await fetch(`/api/bookedride/parent_id=${this.state.parentId}&school_id=${this.state.schoolId}&week_start_date=${this.state.weekStartDateKey}`)
            .then(async bookedRideResponse => await bookedRideResponse.json())
            .then(data => {
                this.setState({ bookedRidesWithDriverInfo: data })
            })

        //Fetch open availability along with driver info so current parent can book rides
        let openAvailabilityResponse = await fetch(`/api/availability/parent_id=${this.state.parentId}&school_id=${this.state.schoolId}&week_start_date=${this.state.weekStartDateKey}&open=1`)
            .then(async openAvailabilityResponse => await openAvailabilityResponse.json())
            .then(data => {
                this.setState({ openAvailabilitiesWithDriverInfo: data })
                console.log("Open availabilities fetched : " + this.state.openAvailabilitiesWithDriverInfo)
            })

            this.setState({allDataInitialized: true});
        }

        componentDidMount() {

        }

    //Handle Change event 
    handleChange = event => {
        this.setState({ [event.target.name] : event.target.value})
        }
    
    handleInputChange(event) {
        const target = event.target;
    //    const value = target.name === 'isGoing' ? target.checked : target.value;
        const name = target.name;
        const value = target.checked;
    
        this.setState({
            [name]: value
        });
    }
    
    handleRideOptionChange() {
        const target = event.target;
        const name = target.name;
        const value = target.checked;
    
        this.setState({
            [name]: value
        });

    }

    // TODO FIX - Ability to update existing records and not just add new availability records for any subsequent visits
    render() {
        console.log("Bookings.jsx Render - weekStartDate : " + this.state.weekStartDate & " & weekStartDateKey : " + this.state.weekStartDateKey)
        const { allDataInitialized } = this.state;

        return (
            allDataInitialized ?
        <div class="container ml-3">
            <div class="row">
                    <h5>Volunteer to drive & book your rides by clicking one of the options for each day</h5>
            </div>
            <div class="row">
                <div class="col">
                    <table class="table">
                        <thead>
                            <tr>
                                <th class="alignCenter">To/From</th>
                                <th class="alignCenter">
                                    <button id="P" name="P" type="button" class="btn btn-link" onClick={this.changeWeek}>Previous Week</button>
                                    {/* <Link
                                        to={{
                                            pathname: "/Bookings",
                                            query: { parentId: this.state.parentId,
                                                    schoolId: this.state.schoolId,
                                                    childId: this.state.childId,
                                                    handleMapClick: this.setSelectedMap,
                                                    weekStartDate: this.state.weekStartDate - 7
                                                    }
                                        }}>Previous Week</Link> */}
                                    <br />
                                    Mon {this.getDateStrForWeekDay(0)}
                                </th>
                                <th class="alignCenter">Tue {this.getDateStrForWeekDay(1)}</th>
                                <th class="alignCenter">Wed {this.getDateStrForWeekDay(2)}</th>
                                <th class="alignCenter">Thu {this.getDateStrForWeekDay(3)}</th>
                                <th class="alignCenter">
                                    <button id="N" name="N" type="button" class="btn btn-link" onClick={this.changeWeek}>Next Week</button>
                                    {/* <Link
                                        to={{
                                            pathname: "/Bookings",
                                            query: { parentId: this.state.parentId,
                                                    schoolId: this.state.schoolId,
                                                    childId: this.state.childId,
                                                    handleMapClick: this.setSelectedMap,
                                                    weekStartDate: this.state.weekStartDate + 7
                                                    }
                                        }}>Next Week</Link> */}
                                    <br />                                    
                                    Fri {this.getDateStrForWeekDay(4)}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>To School</th>
                                <td>
                                    <RideOptions key={["ro_" + this.getDateKeyForWeekDay(0, false) + "_True"]} rideDate={this.getDateKeyForWeekDay(0, false)} toSchoolFlag="True" 
                                    parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                    availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                    openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                    bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} 
                                    handleMapClick={this.handleMapClick} />
                                </td>
                                <td>
                                    <RideOptions key={["ro_" + this.getDateKeyForWeekDay(1, false) + "_True"]} rideDate={this.getDateKeyForWeekDay(1, false)} toSchoolFlag="True" 
                                    parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                    availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                    openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                    bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} 
                                    handleMapClick={this.handleMapClick} />
                                </td>
                                <td>
                                    <RideOptions key={["ro_" + this.getDateKeyForWeekDay(2, false) + "_True"]} rideDate={this.getDateKeyForWeekDay(2, false)} toSchoolFlag="True" 
                                    parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                    availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                    openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                    bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} 
                                    handleMapClick={this.handleMapClick} />
                                </td>
                                <td>
                                    <RideOptions key={["ro_" + this.getDateKeyForWeekDay(3, false) + "_True"]} rideDate={this.getDateKeyForWeekDay(3, false)} toSchoolFlag="True" 
                                    parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                    availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                    openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                    bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} 
                                    handleMapClick={this.handleMapClick} />
                                </td>
                                <td>
                                    <RideOptions key={["ro_" + this.getDateKeyForWeekDay(4, false) + "_True"]} rideDate={this.getDateKeyForWeekDay(4, false)} toSchoolFlag="True" 
                                    parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                    availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                    openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                    bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} 
                                    handleMapClick={this.handleMapClick} />
                                </td>
                            </tr>                        
                            <tr>
                                <th>From School</th>
                                <td>
                                    <RideOptions key={["ro_" + this.getDateKeyForWeekDay(0, false) + "_False"]} rideDate={this.getDateKeyForWeekDay(0, false)} toSchoolFlag="False" 
                                    parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                    availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                    openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                    bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} 
                                    handleMapClick={this.handleMapClick} />
                                    
                                </td>
                                <td>
                                    <RideOptions key={["ro_" + this.getDateKeyForWeekDay(1, false) + "_False"]} rideDate={this.getDateKeyForWeekDay(1, false)} toSchoolFlag="False" 
                                    parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                    availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                    openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                    bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} 
                                    handleMapClick={this.handleMapClick} />                                    
                                </td>
                                <td>
                                    <RideOptions key={["ro_" + this.getDateKeyForWeekDay(2, false) + "_False"]} rideDate={this.getDateKeyForWeekDay(2, false)} toSchoolFlag="False" 
                                    parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                    availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                    openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                    bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} 
                                    handleMapClick={this.handleMapClick} />                                    
                                </td>
                                <td>
                                    <RideOptions key={["ro_" + this.getDateKeyForWeekDay(3, false) + "_False"]} rideDate={this.getDateKeyForWeekDay(3, false)} toSchoolFlag="False" 
                                    parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                    availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                    openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                    bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} 
                                    handleMapClick={this.handleMapClick} />
                                </td>
                                <td>
                                    <RideOptions key={["ro_" + this.getDateKeyForWeekDay(4, false) + "_False"]} rideDate={this.getDateKeyForWeekDay(4, false)} toSchoolFlag="False" 
                                    parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                    availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                    openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                    bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} 
                                    handleMapClick={this.handleMapClick} />
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
            :
            <div class="container ml-3">
                <div class="row">
                    <div class="col">
                        <h3>Loading..</h3>
                    </div>
                </div>
            </div>
        );
    }
}