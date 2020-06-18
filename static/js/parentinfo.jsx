"use strict";

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
            zipcode: "",
            last_login: "",
            childFname: "",
            childLname: "",
            grade: "",
            schoolId: "",
        };

        console.log("Parent Info - parentId : " + this.state.parentId)
  //      console.log("Parent Info - getParentDetails : " + this.props.getParentDetails())

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
          //  this.validateChild = this.validateChild.bind(this)
        }
    
    async componentDidMount() {
        console.log("Parent Info - Going to fetch data")

        //Get Parent Information from the database

            const response = await fetch(`/api/parent/id=${this.state.parentId}`);
            const parentData = await response.json();
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

                //Get Child Information from the database
                let childResponse = await fetch(`/api/child/parent=${this.state.parentId}`);
                
                if (childResponse.ok) {
                    let childData = await childResponse.json();
                    if ((childData != "[object Promise]") && (childData != "")) {
                        // alert("You have logged in successfully");
                        console.log("Parent Info - There is at least one record!");
                        console.log(childData);
                        
                        if (childData.childFname !== ""){
                            console.log("Parent Info - Child Fname returned " + childData.childFname)
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
                        return; 
                      } else {
                        alert("There are no child records...")
                        return;
                      }
                    } else {
                      alert("HTTP-Error: " + childResponse.status);
                      return;
                    } 
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

    handleSubmit(event) {
        event.preventDefault();
     //   this.validateChild();
        console.log("Parent Info - In handleSubmit routine..")

        const ErrMsg = this.state.errorMessage
        if (ErrMsg !== "") {
            alert(this.state.errorMessage);
            this.setState({errorMessage: ""});
        } else {
                console.log("Parent Info - Going to insert data in Child table..")
                const { childFname, childLname, 
                    grade, schoolId, parentId} = this.state;
  
                console.log("Parent Info - Unpacked list below..")
                console.log("Parent Info - ", childFname, "--", childLname, "--", 
                grade, "--", schoolId, "--", parentId, "--")

                const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ childFname, childLname, 
                                                    grade, schoolId, parentId })
                }
                
                console.log("Parent Info - requestOptions", requestOptions, "--")
                fetch('/api/child/add', requestOptions)
                  .then(res => res.json())
                  .then(data => {
                      alert("You've added your child details successfully")
                      console.log(`Parent Info - In handleSubmit routine, child's first name is: ${childFname}`)
                      this.setState({childId: data.id})
                  });
                  }
    }

    render() {
        console.log("Parent Info - In render routine..");

        return (
            <div id="container">
                <div id="showerror" class="row">
                    <div class="col">
                          {/* <textarea name="errorMessage" value={this.state.value} onChange={this.handleChange} /> */}
                    </div>
                </div>
                <div class="row ml-3">
                    {/* <div class="col-9 text-dark border-left border-info border-right border-info border-top border-info"> */}
                    <div class="col-9">
                        <h5>Parent Details</h5>
                    </div>
                </div>
                <div class="row ml-3">
                    {/* <div class="col-5 text-secondary border-bottom border-info border-left border-info"> */}
                    <div class="col-5">
                        <p>Parent Name: {this.state.parentFname} {this.state.parentLname}</p>
                        <p>Phone: {this.state.phone}</p>
                        <p>Email: {this.state.email}</p>
                    </div>
                    {/* <div class="col-4 text-secondary border-bottom border-info border-right border-info"> */}
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
                    {/* <div class="row ml-3">
                        <div class="col=2 ml=5 pading=5 text-secondary d-table-cell">          
                            <label>First Name........</label>
                        </div>          
                        <div class="col=2 text-secondary d-table-cell">
                            <label>Last Name.......</label>
                        </div>

                        <div class="col=2 text-secondary">          
                            <label>Grade.....</label>
                        </div>          

                        <div class="col=2 text-secondary">          
                            <label>School....</label>
                        </div>
                    </div>        */}

                    <div class="row ml-3">
                        
                        <label> First name:       
                            <input 
                                name="childFname" 
                                type="text" 
                                placeholder = "First Name"
                                value={this.state.childFname}
                                onChange={this.handleChange} />
                        </label>          
                        <br />
                        <label> Last name:
                            <input 
                                name="childLname" 
                                type="text" 
                                placeholder = "Last Name"
                                value={this.state.childLname}
                                onChange={this.handleChange} />
                        </label>          
                        <br />
                        <label> Grade:    
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
                        <br />
                        <label>School:       
                            <input 
                                name="schoolId" 
                                type="text" 
                                placeholder = "School"
                                value = {this.state.schoolId}
                                onChange={this.handleChange} />
                        </label>         
                        <br />
                        <label>
                            <button>Submit</button>
                        </label>
                    </div>                    
                </form>
                <label hidden><Link to="/volunteer">Volunteer as driver</Link></label>
            </div>
        );
    }
}  
