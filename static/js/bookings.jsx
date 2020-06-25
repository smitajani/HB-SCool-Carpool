
//TODO Move all children information from ParentInfo into ChildInfo class. Will have to ensure some state variables for child details in ParentInfo are maintained to control display of Bookings
// TODO CODE - Include Previous / Next Week buttons to navigate across different weeks.
class Bookings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            parentId: this.props.parentId,
            schoolId: this.props.schoolId,
            childId: this.props.childId,
            weekStartDate: this.getWeekStartMonday(new Date()),
            mondayDate: this.getWeekStartMonday(new Date()),
            drive_to_0: "",
            drive_to_1: "",
            drive_to_2: "",
            drive_to_3: "",
            drive_to_4: "",
            drive_from_0: "",
            drive_from_1: "",
            drive_from_2: "",
            drive_from_3: "",
            drive_from_4: "",
            poolOptions_20200615_True: "",
            poolOptions_20200616_True: "",
            poolOptions_20200616_False: "",
            availabilitiesWithRiderInfo : {},
            openAvailabilitiesWithDriverInfo : {},
            bookedRidesWithDriverInfo : {},
            allDataInitialized: false,
            errorMessage: ""
        };

        this.handleChange = this.handleChange.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getAllAvailabilitiesAndBookedRides = this.getAllAvailabilitiesAndBookedRides.bind(this)

        this.getAllAvailabilitiesAndBookedRides();
    }

    getWeekStartMonday(d) {
        d = new Date(d);
        var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        var mondayDate = new Date(d.setDate(diff));
        var dateNo = mondayDate.getDate();
        var monthNo = mondayDate.getMonth() + 1;
        var fullYear = mondayDate.getFullYear();
        return mondayDate.getFullYear() + "" + (monthNo < 10?"0" + monthNo:monthNo) + "" + (dateNo < 10?"0" + dateNo:dateNo);
    }    

    getDateForWeekDay(weekStartDateString, offset)
    {
        offsetDate = Date.parse(weekStartDateString)+offset;
        print(offsetDate)
        return offsetDate;
    }

    async getAllAvailabilitiesAndBookedRides() {
        //Fetch current parent availability with rides booked by other parents
        const availabilityResponse = await fetch(`/api/availability/parent_id=${this.state.parentId}&school_id=${this.state.schoolId}&week_start_date=${this.state.weekStartDate}`)
            .then(async availabilityResponse => await availabilityResponse.json())
            .then(data => {
                this.setState({ availabilitiesWithRiderInfo: data })
            })

        //Fetch current parent booked rides with driver info for those rides
        const bookedRideResponse = await fetch(`/api/bookedride/parent_id=${this.state.parentId}&school_id=${this.state.schoolId}&week_start_date=${this.state.weekStartDate}`)
            .then(async bookedRideResponse => await bookedRideResponse.json())
            .then(data => {
                this.setState({ bookedRidesWithDriverInfo: data })
            })

        //Fetch open availability along with driver info so current parent can book rides
        let openAvailabilityResponse = await fetch(`/api/availability/parent_id=${this.state.parentId}&school_id=${this.state.schoolId}&week_start_date=${this.state.weekStartDate}&open=1`)
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

    //TODO - Include validations to ensure that each parent is volunteering for atleast one day before allowing them to pick rides for their children with other drivers
    handleSubmit(event) {
        event.preventDefault();
        console.log("Bookings.jsx: In handleSubmit routine..")

        const ErrMsg = this.state.errorMessage
        if (ErrMsg !== "") {
            alert(this.state.errorMessage);
            this.setState({errorMessage: ""});
        } else {
                const { parentId, schoolId, mondayDate, drive_to_0, drive_to_1, drive_to_2, drive_to_3, drive_to_4,
                    drive_from_0, drive_from_1, drive_from_2, drive_from_3, drive_from_4, 
                    poolOptions_20200615_True, poolOptions_20200616_False, poolOptions_20200616_True} = this.state;
                console.log("Bookings - Going to insert data in Availability table for week starting : " + mondayDate)
  
                console.log("Bookings - Unpacked list below..")
                console.log("Bookings - ", drive_to_0, "--", drive_to_1, "--", 
                drive_to_2, "--", drive_to_3, "--", drive_to_4, "--", drive_from_0, "--", drive_from_1, "--", 
                drive_from_2, "--", drive_from_3, "--", drive_from_4, "--", 
                poolOptions_20200615_True, "--", poolOptions_20200616_True, "--", poolOptions_20200616_False)

                const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ parentId, schoolId, mondayDate,
                                drive_to_0, drive_to_1, drive_to_2, drive_to_3, drive_to_4,
                                drive_from_0, drive_from_1, drive_from_2, drive_from_3, drive_from_4})
                }
                
                console.log("Bookings - requestOptions", requestOptions, "--")
                fetch('/api/availability/add', requestOptions)
                  .then(res => res.json())
                  .then(data => {
                      alert("You've added your availability details successfully")
                      console.log(data)
                      this.state({availability: data})
                  });
        }
    }

    // TODO FIX - Ability to update existing records and not just add new availability records for any subsequent visits
    render() {
        console.log("Bookings.jsx: In render routine..");
        const { allDataInitialized } = this.state;
        console.log("Bookings.jsx: allDataInitialized..", allDataInitialized);

        
        return (allDataInitialized ?
                <div class="container ml-3">
                    <div class="row">
                        <div class="col">
                            <h5>Volunteer to drive & book your rides by clicking one of the options for each day</h5>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col" align="center"></th>
                                        <th scope="col" align="center">Mon</th>
                                        <th scope="col" align="center">Tue</th>
                                        <th scope="col" align="center">Wed</th>
                                        <th scope="col" align="center">Thu</th>
                                        <th scope="col" align="center">Fri</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>To</th>
                                        <td>
                                            <RideOptions key="ro_20200615_True" rideDate="20200622" toSchoolFlag="True" 
                                            parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                            availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                            openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                            bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} />
                                        </td>
                                        <td>
                                            <RideOptions key="ro_20200616_True" rideDate="20200623" toSchoolFlag="True" 
                                            parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                            availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                            openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                            bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} />
                                        </td>
                                        <td>
                                            <RideOptions key="ro_20200617_True" rideDate="20200624" toSchoolFlag="True" 
                                            parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                            availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                            openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                            bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} />
                                        </td>
                                        <td>
                                            <RideOptions key="ro_20200618_True" rideDate="20200625" toSchoolFlag="True" 
                                            parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                            availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                            openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                            bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} />
                                        </td>
                                        <td>
                                            <RideOptions key="ro_20200619_True" rideDate="20200626" toSchoolFlag="True" 
                                            parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                            availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                            openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                            bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} />
                                        </td>
                                    </tr>                        
                                    <tr>
                                        <th>From</th>
                                        <td>
                                            <RideOptions key="ro_20200615_False" rideDate="20200622" toSchoolFlag="False"
                                            parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                            availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                            openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                            bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} />
                                            
                                        </td>
                                        <td>
                                            <RideOptions key="ro_20200616_False" rideDate="20200623" toSchoolFlag="False"
                                            parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                            availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                            openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                            bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} />                                    
                                        </td>
                                        <td>
                                            <RideOptions key="ro_20200617_False" rideDate="20200624" toSchoolFlag="False"
                                            parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                            availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                            openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                            bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} />                                    
                                        </td>
                                        <td>
                                            <RideOptions key="ro_20200618_False" rideDate="20200625" toSchoolFlag="False"
                                            parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                            availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                            openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                            bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} />
                                        </td>
                                        <td>
                                            <RideOptions key="ro_20200619_False" rideDate="20200626" toSchoolFlag="False"
                                            parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId}
                                            availabilitiesWithRiderInfo={this.state.availabilitiesWithRiderInfo} 
                                            openAvailabilitiesWithDriverInfo={this.state.openAvailabilitiesWithDriverInfo} 
                                            bookedRidesWithDriverInfo={this.state.bookedRidesWithDriverInfo} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
        : <div class="container ml-3">
                    <div class="row">
                        <div class="col">
                            <h3>Loading..</h3>
                        </div>
                    </div>
            </div>
        );
    }
}