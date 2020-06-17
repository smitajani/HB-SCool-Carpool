"use strict";

class ParentInfo extends React.Component {
    constructor(props) {
        super(props);

        //Initial state of component
        this.state = {
            isLoading: true,
            errorMessage: "",
            parentId: this.props.getParentDetails(),
            email: this.props.email,
            id: this.props.id,
            parentFname: "",
            parentLname: "",
            address1: "",
            address2: "",
            city: "",
            resState: "",
            phone: "",
            zipcode: "",
            last_login: ""
            ,
            childFname: "",
            childLname: "",
            grade: "",
            schoolId: ""
        };
        console.log("In parentInfo parentId : " + this.state.parentId)
        console.log("In parentInfo getParentDetails : " + this.props.getParentDetails())

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
          //  this.validateChild = this.validateChild.bind(this)
        }
    
    async componentDidMount() {

        //Get Parent Information from the database
            const response = await fetch(`/api/parent/id=${this.state.parentId}`);
            const parentData = await response.json();
            this.setState({
                isLoading: false,
                id: parentData.id,
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
                        console.log("There is at least one record!");
                        console.log(childData);
                        
                        if (childData.childFname !== ""){
                            console.log("Child Fname returned " + childData.childFname)
                            this.setState({
                                isLoading: false,
                                id: childData.id,
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
        console.log("In handleSubmit routine of ParentInfo..")

        const ErrMsg = this.state.errorMessage
        if (ErrMsg !== "") {
            alert(this.state.errorMessage);
            this.setState({errorMessage: ""});
        } else {
                const { childFname, childLname, 
                    grade, schoolId, parentId} = this.state;
  
                const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ childFname, childLname, 
                                                    grade, schoolId, parentId })
                }
                
                fetch('/api/child/add', requestOptions)
                  .then(res => res.json())
                  .then(data => {
                      alert("You've added your child details successfully")
                      console.log(childFname)
                      this.setState({id: data.id})
                  });
                  }
    }

    render() {
        console.log("In render routine of ParentInfo class..");

        return (
            <div id="container">
                 <div id="showerror" class="row">
                    <div class="col">
                          {/* <textarea name="errorMessage" value={this.state.value} onChange={this.handleChange} /> */}
                    </div>
                </div>
                <div class={"row", "ml-3"}>
                    <div class="col">
                    <h5>Parent Details</h5>
                        <p>Parent Name: {this.state.parentFname} {this.state.parentLname}</p>
                        <p>Address: {this.state.address1}<br />{this.state.address2}</p>
                        <p>{this.state.city}, {this.state.resState} - {this.state.zipcode}</p>
                        <p>Phone: {this.state.phone}</p>
                    </div>
                </div>    
                <div class={"row", "ml-3"}>
                    <div class="col">
                        <h5>Please enter your children information</h5>
                        <form onSubmit={this.handleSubmit}>                    
                            <label>
                                Child - First Name: 
                                <input 
                                    name="childFname" 
                                    type="text" 
                                    placeholder = "First Name"
                                    value={this.state.childFname}
                                    onChange={this.handleChange} />
                            </label>
                            <br />

                            <label>
                                Last Name: 
                                    <input 
                                    name="childLname" 
                                    type="text" 
                                    placeholder = "Last Name"
                                    value={this.state.childLname}
                                    onChange={this.handleChange} />
                            </label>
                            <br />

                            <label>
                                Grade: 
                                <input 
                                    name="grade" 
                                    type="text" 
                                    placeholder = "Grade"
                                    value = {this.state.grade}
                                    onChange={this.handleChange} />
                            </label>
                            <br />

                            <label>
                                School: 
                                <input 
                                    name="schoolId" 
                                    type="text" 
                                    placeholder = "School"
                                    value = {this.state.schoolId}
                                    onChange={this.handleChange} />
                            </label>
                            <br />

                            <br />
                            <button>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

}  
