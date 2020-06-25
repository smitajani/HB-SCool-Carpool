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
            childId: ""
        };

        console.log("Parentinfo.jsx: parentId : " + this.state.parentId)

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.getSchools = this.getSchools.bind(this)
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
        
        if (zipcode != "94087-3300") {
            zipcode="94087-3300"
        }

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

                this.setState({
                    isLoading: false,
                    schoolId: schoolData.id,
                    schoolName: schoolData.school_name
                });
                return schoolData;
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
            let childData = await childResponse.json();
            if ((childData != "[object Promise]") && (childData != "")) {
                // alert("You have logged in successfully");
                console.log("Parentinfo.jsx: There is at least one child record!");
                console.log("Parentinfo.jsx: childData --", childData);
                
                if (childData.childFname !== null){
                    console.log("Parentinfo.jsx: Child Fname returned " + childData.childFname)
                    this.setState({
                        isLoading: false,
                        childId: childData.id,
                        childFname: childData.childFname,
                        childLname: childData.childLname,
                        grade: childData.grade,
                        schoolId: childData.schoolId,
                        parentId: childData.parentId
                    });
                }
            } else if (childData == "[object Promise]") {
                alert("Loading data..");
                console.log("Parentinfo.jsx: Loading child info");
                return; 
                } else {
                alert("There are no child records...")
                console.log("Parentinfo.jsx: HTTP-Error, ", childResponse.status);
                return;
                }
            } else {
                alert("HTTP-Error: " + childResponse.status);
                console.log("Parentinfo.jsx: HTTP-Error, ", childResponse.status);
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
                //Render the error message in the Error-Message tag
                return (this.state.errorMessage)
            }
        
        if (this.state.childLname.length < 2) {
            this.state.errorMessage = "Please enter a valid last name!"
            //Render the error message in the Error-Message tag
            return(this.state.errorMessage)
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
        const value = target.checked;
    
        this.setState({
          [name]: value
        });
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
        console.log("Parent Info - In render routine..", this.state.schoolId);
        return (

 //            <ManageAccount email={this.state.email} parentId={this.state.parentId} zipcode={this.state.zipcode} />

                <div id="container">
                    <div id="showerror" class="row">
                        <div class="col">
                            {/* <textarea name="errorMessage" value={this.state.value} onChange={this.handleChange} /> */}
                        </div>
                    </div>
                    <div class="row ml-3">
                        {/*
                        <div class="col-9 text-dark border-left border-info border-right border-info border-top border-info"> */}
                            <div class="col-9">
                                <h5>Parent Details</h5>
                            </div>
                        </div>
                        <div class="row ml-3">
                            {/*
                            <div class="col-5 text-secondary border-bottom border-info border-left border-info"> */}
                                <div class="col-5">
                                    <p>Parent Name: {this.state.parentFname} {this.state.parentLname}</p>
                                    <p>Phone: {this.state.phone}</p>
                                    <p>Email: {this.state.email}</p>
                                </div>
                                {/*
                                <div class="col-4 text-secondary border-bottom border-info border-right border-info"> */}
                                    <div class="col-4">
                                        <p>Address: {this.state.address1},</p>
                                        <p>{this.state.address2}</p>
                                        <p>{this.state.city}, {this.state.resState} - {this.state.zipcode}</p>
                                    </div>
                                </div>
                                <div>
                                    <br /><br />
                                </div>
                                <div class="row ml-3">
                                    <div class="col-9 text-dark">
                                        <h5>Children Information:</h5>
                                    </div>
                                </div>
                                <form onSubmit={this.handleSubmit}>
                                    <div class="row ml-3">
                                        <div class="col-2">
                                            <label> First name:       
                                        <input 
                                            name="childFname" 
                                            type="text" 
                                            placeholder = "First Name"
                                            value={this.state.childFname}
                                            onChange={this.handleChange} />
                                    </label>
                                        </div>
                                        <div class="col-2">
                                            <label> Last name:
                                        <input 
                                            name="childLname" 
                                            type="text" 
                                            placeholder = "Last Name"
                                            value={this.state.childLname}
                                            onChange={this.handleChange} />
                                    </label>
                                        </div>
                                        <div class="col-2" align="center">
                                            <label> Grade:    <br />
                                        <select name="grade" onChange={this.handleChange}>
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
                                    </label>
                                        </div>
                                        {/* TODO - Include a Mapbox based school selector */}
                                        <div class="col-2">
                                            <label>School:       
                                        <input 
                                            name="schoolId" 
                                            type="text" 
                                            placeholder = "School"
                                            value = {this.state.schoolId}
                                            onChange={this.handleChange} 
                                            />
                                    </label>
                                        </div>
                                        <div class="col-2">
                                            <br /> {this.state.childFname?
                                            <label>
                                            <button>Edit & Save</button>
                                        </label> :
                                            <label>
                                        <button>Submit</button>
                                    </label> }
                                        </div>
                                    </div>
                                </form>
                                <label hidden><Link to="/volunteer">Volunteer as driver</Link></label>
                                <br /><br /> {this.state.schoolId ?
                                <Bookings parentId={this.state.parentId} schoolId={this.state.schoolId} childId={this.state.childId} /> :
                                <div></div>
                                }
                            </div>



        );
    }
} 