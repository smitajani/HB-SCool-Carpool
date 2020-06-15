
class SignUp extends React.Component {
  constructor(props) {
    console.log("Signup constructor")
    super(props);
    
    //Initial state of component
    this.state = {
        isLoading: true,
        errorMessage: "",

        id: "",
        parentFname: "",
        parentLname: "",
        address1: "",
        address2: "",
        city: "",
        resState: "",
        email: "",
        phone: "",
        zipcode: "",
        password: ""
    };

        // Required binding to make `this` work in the callback
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.ValidateParent = this.ValidateParent.bind(this)
    }

    //ComponentDidMount: This function indicates that it 
    //has been mounted at least once and is ready to 
    //render data if 'fetch' has successfully 
    //fetched the data.

    //Explicitly stating fetch is loaded asynchronously.
    //'await' ensures asynch tasks wait for the dependent 
    //task to complete, before it executes - as a result, 
    // forcing them to be synchronous. 

    async componentDidMount() {

        let queryParam = "";
        if ((this.state.id != "") || (this.state.email != "")) {
            if (this.state.id != "") {
                queryParam = `id=${this.state.id}`;            
            
            } else {
                queryParam = `email=${this.state.email}`;
            }
        
            const response = await fetch(`/api/parent/${queryParam}`);
            const userData = await response.json();
        
            this.setState({
                isLoading: false,
                id: userData.id,
                parentFname: userData.parentFname,
                parentLname: userData.parentLname,
                address1: userData.address1,
                address2: userData.address2,
                city: userData.city,
                resState: userData.resState,
                email: userData.email,
                zipcode: userData.zipcode
              });

        } else {
            this.setState({isLoading: false})
        } 
    }

    //Post MVP: Get the message display working and expand on field validations
    ValidateParent() {
        
        if (this.state.parentFname.length < 2) {

            this.state.errorMessage = "Please enter a valid first name!"
                //Render the error message in the Error-Message tag
                return (this.state.errorMessage)
            }
        
        if (this.state.parentLname.length < 2) {
            this.state.errorMessage = "Please enter a valid last name!"
            //Render the error message in the Error-Message tag
            return(this.state.errorMessage)
        }
        
    }

    //Handle Change event 
     handleChange = event => {
        this.setState({ [event.target.name] : event.target.value})
     }
    

    //Validate the values entered and send request to backend
    handleSubmit(event) {
      event.preventDefault();
      this.ValidateParent();

      const ErrMsg = this.state.errorMessage
      if (ErrMsg !== "") {
          alert(this.state.errorMessage);
          this.setState({errorMessage: ""});
      } else {
              const { parentFname, parentLname, 
                  email, phone, address1, address2, 
                  city, resState, zipcode, password  } = this.state;

              const requestOptions = {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ parentFname, parentLname, 
                                                  email, phone, address1, address2, 
                                                  city, resState, zipcode, password })
              }
              
              fetch('/api/parent/add', requestOptions)
                .then(res => res.json())
                .then(data => {
                  alert("Congratulations! you have signed-up successfully")
                  console.log(email)
                  this.setState({id: data.id})
                  this.props.setParentDetails(data);

                //this.props.render(<ParentInfo path="/api/parent/email="email />, document.getElementById('accountinfo'))  
                
                //ReactDOM.render(<ParentInfo />, document.getElementById('accountinfo'));

                // this.render(<Route path="/api/parent/:email" component={parent} />);

              })
           }
        }

  
  render() {
    return(
        <div>
            (this.state.isLoading) ? 
            <div>Loading..</div> :  
            <div>
                <h5>Signup to start booking rides</h5>
                <form onSubmit={this.handleSubmit}>
                                
                    <label>
                        First Name: 
                        <input 
                            name="parentFname" 
                            type="text" 
                            placeholder = "First Name"
                            value={this.state.parentFname}
                            onChange={this.handleChange} />
                    </label>
                    <br />

                    <label>
                        Last Name: 
                            <input 
                            name="parentLname" 
                            type="text" 
                            placeholder = "Last Name"
                            value={this.state.parentLname}
                            onChange={this.handleChange} />
                    </label>
                    <br />

                    <label>
                        Address-1: 
                        <input 
                            name="address1" 
                            type="text" 
                            placeholder = "Street Address"
                            value = {this.state.address1}
                            onChange={this.handleChange} />
                    </label>
                    <br />

                    <label>
                        Address-2: 
                        <input 
                            name="address2" 
                            type="text" 
                            placeholder = "House/Apt Number"
                            value = {this.state.address2}
                            onChange={this.handleChange} />
                    </label>
                    <br />

                    <label>
                        City: 
                        <input 
                            name="city" 
                            type="text" 
                            placeholder = "City"
                            value = {this.state.city}
                            onChange={this.handleChange} />
                    </label>
                    <br />
                    
                    <label>
                        State: 
                        <input 
                            name="resState" 
                            type="text" 
                            value = {this.state.resState}
                            onChange={this.handleChange} />
                    </label>
                    <br />

                    <label>
                        Zip: 
                        <input 
                            name="zipcode" 
                            type="text" 
                            placeholder = "zipcode"
                            value = {this.state.zipcode}
                            onChange={this.handleChange} />
                    </label>
                    <br />

                    <label>
                        Phone: 
                        <input 
                            name="phone" 
                            type="text" 
                            placeholder = "phone no."
                            value = {this.state.phone}
                            onChange={this.handleChange} />
                    </label>
                    <br />

                    <label>
                        Email: 
                        <input 
                            name="email" 
                            type="text" 
                            placeholder = "example@example.com"
                            value = {this.state.email}
                            onChange={this.handleChange} />
                    </label>
                    <br />

                    <label>
                        Password: 
                        <input 
                            name="password" 
                            type="text" 
                            placeholder = "password"
                            value = {this.state.password}
                            onChange={this.handleChange} />
                    </label>
                    <br />
                    <button>Sign Up</button>
                </form>
            </div>
        </div>
        );
    }
}
