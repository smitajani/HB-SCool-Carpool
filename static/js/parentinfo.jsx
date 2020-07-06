"use strict";
// TODO - Include D3 based visualizations for Ride Analytics
// TODO - Rename as ManageAccount with new components for Parent & Child
class ParentInfo extends React.Component {
    constructor(props) {
        super(props);

        //Initial state of component
        this.state = {
            isLoading: true,
            errorMessage: "",
            parentId: this.props.parentId,
            email: this.props.email,
            parentFname: "",
            parentLname: "",
            address1: "",
            address2: "",
            city: "",
            resState: "",
            phone: "",
            zipcode: this.props.zipcode,
            last_login: "",
            childFname: "",
            childLname: "",
            grade: "",
            schoolId: "",
            childId: "",
            toggleChildButton: true,
			selAvailabilityId: "-1",
            showBookings: false,
            showMap: false,
            children: {},
            listOfChildren: "",
            listOfSchools: "",
        };

        console.log("Parentinfo.jsx: parentId : " + this.state.parentId)

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.toggleChildButton = this.toggleChildButton.bind(this)
        // this.handleInputChange = this.handleInputChange.bind(this)
        this.getSchools = this.getSchools.bind(this)
        this.selectChild = this.selectChild.bind(this)
        this.setSelectedMap = this.setSelectedMap.bind(this)
        this.hideMap = this.hideMap.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        }
    
        handleLogout(event) {
            this.setState({parentId: ""})
            this.props.logout()
        }

    toggleChildButton() {
            const toggleChildButton = this.state.toggleChildButton;
            this.setState({ toggleChildButton: !toggleChildButton });
  
    }

    setSelectedMap(availabilityId) {
        console.log("In parent info setSelectedMap : " + availabilityId)
        this.getAddressesForTrip(availabilityId)
    }
        
          hideMap(event) {
            this.setState({showMap: false });
          };        
    
        async getAddressesForTrip(availabilityId) {
        console.log("Parent Info - Going to fetch addresses for trip")

        //Get Address Information for the trip from the database
        const addressesResponse = await fetch(`/api/availability/id=${availabilityId}`);
 
        if (addressesResponse.ok) {
            let addressData = await addressesResponse.json();
            if ((addressData != "[object Promise]") && (addressData != "")) {
                console.log("Parent Info - There is at least one addressData record!");
                console.log(addressData);
                
                this.setState({
                    isLoading: false,
                    tripAddresses: addressData,
                    showMap: true
                });
            } else if (addressData == "[object Promise]") {
                alert("Loading data..");
                console.log("Parent Info - Loading address data");
                return; 
                } else {
                alert("There are no address details...")
                console.log("Parent Info - No address data");
                return;
                }
            } else {
                alert("HTTP-Error: " + addressesResponse.status);
                console.log("Parent Info - HTTP-Error, ", addressesResponse.status);
                return;
            } 
        }

 
    //Get Parent Information from the database    
    async getParent(){
        console.log("Parentinfo.jsx: In getParent()..")

        const parentId = this.state.parentId;
        const fetch_URL = (`/api/parent/id=${parentId}`);
        console.log(`ParentInfo.jsx: getParent() - Fetch URL: ${fetch_URL}`);
        
        let parentResponse = await fetch(fetch_URL);
        //const parentResponse = await fetch(fetch_URL);
        console.log(`ParentInfo.jsx: getParent() - parentResponse: ${parentResponse}`);

        if (parentResponse.ok) {
            let parentData = await parentResponse.json();
            if ((parentData != "[object Promise]") && (parentData != "")) {
                console.log("ParentInfo.jsx: getParent() - Fetched parent info successfully");
                console.log(`Parent data: getParent() - ${parentData}`);
                console.log(parentData);

                this.setState({
                        isLoading: false,
                        parentId: parentData.id,
                        parentFname: parentData.parentFname,
                        parentLname: parentData.parentLname,
                        address1: parentData.address1,
                        address2: parentData.address2,
                        city: parentData.city,
                        resState: parentData.resState,
                        email: parentData.email,
                        phone: parentData.phone,
                        zipcode: parentData.zipcode,
                        last_login: parentData.last_login
                    });

                return parentData;
            }
            else if (parentData == "[object Promise]") {
                this.setState({errorMessage: "Loading.."});
                console.log("ParentInfo.jsx: getParent() - Loading data");
                alert("Loading data..");
                return; 
            } else {
                this.setState({errorMessage: "User does not exist"});
                console.log("ParentInfo.jsx: getParent() - User does not exist");
                alert("User does not exist...")
                return;
            }
        } else {
            this.setState({errorMessage: "HTTP Error"});
            console.log("ParentInfo.jsx: getParent() - HTTP error");
            alert("HTTP-Error: Hmm.. Something is not right!", parentResponse.status);
            return;
        }

    }


    //Get School Information from the database 
    async getSchools() {
        console.log("Parentinfo.jsx: getSchools() - Going to fetch list of schools")
        
        //Get School Information from the database
        let zipcode = this.state.zipcode;

        const fetch_URL = (`/api/schools/zipcode=${zipcode}`);
        console.log(`ParentInfo.jsx: getSchools() - Fetch URL: ${fetch_URL}`);
        
        let schoolResponse = await fetch(fetch_URL);
        // const schoolResponse = await fetch(`/api/schools/zipcode=${this.state.zipcode}`);
 
        if (schoolResponse.ok) {
            let schoolData = await schoolResponse.json();
            if ((schoolData != "[object Promise]") && (schoolData != "")) {
                console.log("Parentinfo.jsx: getSchools() - There is at least one school record!");
                console.log(`Parentinfo.jsx: getSchools() - School data: ${schoolData}`);
                console.log(schoolData);
        
                const listOfSchools = [];
        
                for (const id in schoolData) {
                    listOfSchools.push(
                        <option value={id}>
                            {schoolData[id]}
                        </option>
                    )
                    console.log(listOfSchools)
                }
        
                this.setState({
                    isLoading: false,
                    schools: schoolData,
                    listOfSchools: listOfSchools
                });
                
                return;
        
            }
            else if (schoolData == "[object Promise]") {
                this.setState({errorMessage: "Loading.."});
                console.log("ParentInfo.jsx: getSchools() - Loading data");
                alert("Loading data..");
                return; 
            } else {
                this.setState({errorMessage: "Unable to fetch schools"});
                console.log("ParentInfo.jsx: getSchools() - unable to fetch schools");
                alert("Unable to fetch schools")
                return;
            }
        } else {
            this.setState({errorMessage: "Hmm..Something is not right!"});
            console.log("ParentInfo.jsx: getSchools() - HTTP error");
            alert("HTTP-Error: " + schoolResponse.status);
            return;
        }

    }


    //Get Children Information from the database
    async getChildren() {
       
        let childResponse = await fetch(`/api/child/parent=${this.state.parentId}`);
             
        if (childResponse.ok) {
            let children = await childResponse.json();
            if ((children != "[object Promise]") && (children != "")) {
                // alert("You have logged in successfully");
                console.log("Parentinfo.jsx: getChildren() - There is at least one child record!");
                console.log("Parentinfo.jsx: getChildren() - Child data --", children);
                   
                let selectedChild = "";
                let selectedSchool = "";
                // Set the first (or only child in case of only one child) child as the selected one so that the schedule can be displayed for the selected child
                    for (const items of Object.values(children)) {
                        if (selectedChild == "") {
                            selectedChild = items[0];
                            selectedSchool = items[4]

                            console.log("Parentinfo.jsx: getChildren() - Default selection --", selectedChild, selectedSchool)

                            this.setState({
                                isLoading: false,
                                childId: selectedChild,
                                schoolId: selectedSchool,
                                children: children
                            });
                            return;
                        }
                    }
             
            } else if (children == "[object Promise]") {
                this.setState({errorMessage: "Loading.."});
                console.log("Parentinfo.jsx: getChildren() - Loading child data");
                return; 
            } else {
                this.setState({errorMessage: "Unable to fetch children"});
                console.log("ParentInfo.jsx: getChildren() - unable to fetch schools");
                alert("Unable to fetch child data")
                return;
            }
        } else {
            this.setState({errorMessage: "Hmm..Something is not right!"});
            console.log("ParentInfo.jsx: getChildren() - HTTP error");
            alert("HTTP-Error: " + childResponse.status);
            return;
        } 
 
    }

    componentDidMount() {
        console.log("Parentinfo.jsx: componentDidMount - Going to fetch parent data")

        // Get Parent Information from the database
        const parent = this.getParent();

        console.log("Parentinfo.jsx: componentDidMount - Going to fetch schools info")
        const school = this.getSchools();

        console.log("Parentinfo.jsx: componentDidMount - Going to fetch children info")
        const children = this.getChildren();
    }

    //Post MVP: Get the message display working and expand on field validations
    validateChild() {
        
        if (this.state.childFname.length < 2) {

            this.state.errorMessage = "Please enter a valid first name!"
                //TODO: Render the error message in the Error-Message tag
                return (this.state.errorMessage)
            }
        
        if (this.state.childLname.length < 2) {
            this.state.errorMessage = "Please enter a valid last name!"
            //TODO: Render the error message in the Error-Message tag
            return(this.state.errorMessage)
        }
        
    }

    //Handle Change event 
    handleChange = event => {
    this.setState({ [event.target.name] : event.target.value})
    }


    //Child name click event 
    selectChild = event => {
        this.setState({ childId: [event.target.name]})
        
        console.log("Selected child 1: " + [event.target.name])
        console.log("Selected child 2: " + this.state.childId)
    }

    handleSubmit(event) {
        event.preventDefault();
     //   this.validateChild();
        console.log("Parentinfo.jsx: In handleSubmit routine..")

        const ErrMsg = this.state.errorMessage
        if (ErrMsg !== "") {
            alert(this.state.errorMessage);
            this.setState({errorMessage: ""});
        } else {
                console.log("Parentinfo.jsx: Going to insert data in Child table..")
                const { childFname, childLname, 
                    grade, schoolId, parentId} = this.state;
  
                console.log("Parentinfo.jsx: Unpacked list below..")
                console.log("Parentinfo.jsx: ", childFname, "--", childLname, "--", 
                grade, "--", schoolId, "--", parentId, "--")

                const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ childFname, childLname, 
                                                    grade, schoolId, parentId })
                }
                
                console.log("Parentinfo.jsx: requestOptions", requestOptions, "--")
                fetch('/api/child/add', requestOptions)
                  .then(res => res.json())
                  .then(data => {
                      alert("You've added your child details successfully")
                      console.log(`Parentinfo.jsx: In handleSubmit routine, child's first name is: ${childFname}`)
                      this.setState({childId: data.id})
                  });
                  }
    }

    //   TODO - Apply proper CSS so that the screens look more visually appealing and show contemporary UI
    render() {
        console.log("Parent Info - In render routine..");

        let listOfChildren = []
        if (this.state.children != undefined) {
            for (const child of Object.values(this.state.children)) {
                if (child[0] == this.state.childId) {
                    listOfChildren.push(
                            <a name={child[0]} class="line-wipe selected-child" id={child[0]} onClick={this.selectChild}>
                            &nbsp;&nbsp;{child[1]} ({child[3]})&nbsp;&nbsp;|</a> 
                    )}
                else {
                    listOfChildren.push(
                            <a name={child[0]} class="line-wipe custom-display-text" id={child[0]} onClick={this.selectChild}>
                            &nbsp;&nbsp;{child[1]} ({child[3]})&nbsp;&nbsp;|</a> 
                )}    
            }
        }

        if (this.state.parentId == "") {
            return (<Redirect to="/" />);
        }

        return (
                <div id="container" class="ml-3">
                    <section class="row ml-3">
                        <div class="col-5">
                            <input type="checkbox" id="drawer-toggle" name="drawer-toggle" hidden/>
                                <label for="drawer-toggle" id="drawer-toggle-label"></label>
                                <header>{this.state.parentFname} {this.state.parentLname}</header> 
                                <nav id="drawer">
                                <div class="custom-drawer-text">
                                    <br />
                                    <h5>Parent: {this.state.parentFname} {this.state.parentLname}</h5>
                                    <br />
                                    <p>Phone: {this.state.phone}</p>
                                    <p>Email: {this.state.email}</p>
                                    <p>Address: {this.state.address1},</p>
                                    <p>        {this.state.address2}</p>
                                    <p>        {this.state.city}</p>
                                    <p>        {this.state.resState} - {this.state.zipcode}</p>
                                </div>
                            </nav>
                        </div>
                        <div class="col-6">
                                <nav>{listOfChildren} <button id="P" name="P" type="button" class="btn btn-link" onClick={this.toggleChildButton}>+</button></nav>
                                {/* <button class="btn custom-button-1" onClick={this.toggleChildButton}>+</button> */}
                        </div>
                        <div class="col-1">
                         <button id="P" name="P" type="button" class="btn btn-link" onClick={this.handleLogout}>Logout</button>
                            {/* <a class="line-wipe" onClick={this.handleLogout}>Logout</a> */}
                        </div>
                    </section>
                    <section class="row ml-3" hidden={this.state.toggleChildButton}>
                        <table>
                            <thead>
                                <tr>
                                    <td>First name</td>
                                    <td>Last name</td>
                                    <td>Grade</td>
                                    <td>School</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="input-td">
                                <td><input 
                                        name="childFname" 
                                        type="text" 
                                        class = "custom-input"
                                        placeholder = "First Name"
                                        value={this.state.childFname}
                                        onChange={this.handleChange} />
                                </td>
                                <td><input 
                                        name="childLname" 
                                        type="text" 
                                        class = "custom-input"
                                        placeholder = "Last Name"
                                        value={this.state.childLname}
                                        onChange={this.handleChange} />
                                </td>
                                <td><select name="grade" class="custom-select-dd" onChange={this.handleChange}>
                                        <option value="-1">Select grade</option>
                                            <option value="TK">TK</option>
                                            <option value="K">K</option>
                                            <option value="G1">G1</option>
                                            <option value="G2">G2</option>
                                            <option value="G3">G3</option>
                                            <option value="G4">G4</option>
                                            <option value="G5">G5</option>
                                            <option value="G6">G6</option>
                                            <option value="G7">G7</option>
                                            <option value="G8">G8</option>
                                        </select>  
                                </td>
                                <td><select name="schoolId" class="custom-select-dd" 
                                            value={this.state.schoolId} onChange={this.handleChange}>
                                            <option value="-1">Select school</option>
                                            {this.state.listOfSchools}
                                    </select> 
                                </td>
                                <td>
                                    <button class="btn custom-button-1" onClick={this.handleSubmit}>Save</button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </section>
                    <div id="container font-weight-light">
                        { this.state.showMap ? 
                            <div className={this.state.showMap ? "modal display-block" : "modal display-none"}>
                                <div className='sidebarStyle'>
                                    <div>Date: {this.state.tripAddresses.ride_date} | Driver: {this.state.tripAddresses.driver_name} | Destination: {this.state.tripAddresses.school_name}</div>
                                </div>            
                                <div class="mapContainer">
                                    <ShowMap showMap={this.state.showMap} handleClose={this.hideMap} 
                                    token={mapboxgl.accessToken} tripAddresses={this.state.tripAddresses} />
                                    {/* <MyMap showMap={this.state.showMap} handleClose={this.hideMap} /> */}
                                </div>
                                <div className="mapCloseStyle">
                                    <button onClick={this.hideMap}>Close</button>
                                </div>
                            </div>
                        :
                        <div></div>
                        }
                        <div id="showerror" class="row">
                            <div class="col">
                                {/* <textarea name="errorMessage" value={this.state.value} onChange={this.handleChange} /> */}
                            </div>
                        </div>
                        <label hidden><Link to="/volunteer">Volunteer as driver</Link></label>
                        <br /><br />
                        {this.state.childId ?
                            <div>
                                <Bookings parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId} 
                                handleMapClick={this.setSelectedMap} />
                            </div>
                            :
                            <div></div>
                        }
                    </div>
            </div>
        );
    }
}