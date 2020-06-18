
class SignUp extends React.Component {
  
    constructor(props) {
    console.log("Signup constructor")
    super(props);
    
    //Initial state of component
    this.state = {
        isLoading: false,
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
        this.validateParent = this.validateParent.bind(this)
    }


    //Handle Change event 
    handleChange = event => {
        this.setState({ [event.target.name] : event.target.value})
     }

    //Post MVP: Get the message display working and expand on field validations
    validateParent() {
        
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

    //Submit event - Validate the values entered and send request to backend
    handleSubmit(event) {
        event.preventDefault();
        this.validateParent();
        console.log(this.state.email)
      
        //Check if the record exists
        const data = this.userExists();
        console.log(`..And my data is: ${data}`);
  
        const { errorMessage, email, id } = this.state;
        console.log(`errorMessage is ${errorMessage}`)
        console.log(`email is ${email}`)
        console.log(`id (id) is ${id}`)

        if (errorMessage !== "") {
          alert(errorMessage);
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
                      this.props.setParentDetails(data)
                  });
                  }
      }


  async userExists() {

    console.log("In userExists routine...");

    const email = this.state.email;
    console.log(email)

    const fetch_URL = (`/api/parent/email=${email}`);
    console.log(`Fetch URL: ${fetch_URL}`);

    let res = await fetch(fetch_URL);
      
    if (res.ok) {
      let data = await res.json(); 
      if ((data != "[object Promise]") && (data != "")) {
          alert("You have an existing account, please login using your email/password")
          console.log("Existing account");
          console.log(data);
          this.setState({errorMessage: "Existing account"});
          this.props.setParentDetails([data.email])
          return; 
      } 
      else if (data == "[object Promise]") {
        this.setState({errorMessage: "Loading.."});
        alert("Verifying..");
        return; 
      } else {
        console.log("User does not exist. New user, ok to signup!");
        this.setState({errorMessage: ""});
        return;
      }
    } else {
      alert("HTTP-Error: " + res.status);
      this.setState({errorMessage: "Hmm! Something is not right - It's not you, it's us!"});
      return;
    }
      
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
        console.log("In componentDidMount routine of SignUp.. 1");

        let queryParam = "";
        if ((this.state.id != "") || (this.state.email != "")) {
            console.log("In componentDidMount routine of SignUp.. 1.1");
            if (this.state.id != "") {
                console.log("In componentDidMount routine of SignUp.. 1.1.1");
                queryParam = `id=${this.state.id}`;            
                console.log("In componentDidMount routine of SignUp.. 1.1.1.1", queryParam);
            } else {
                console.log("In componentDidMount routine of SignUp.. 1.1.2");
                queryParam = `email=${this.state.email}`;
                console.log("In componentDidMount routine of SignUp.. 1.1.2.1", queryParam);
            }
            console.log("In componentDidMount routine of SignUp.. 2", queryParam);
            const response = await fetch(`/api/parent/${queryParam}`);
            const userData = await response.json();
        
            console.log("In componentDidMount routine of SignUp.. 3");
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
              console.log("In componentDidMount routine of SignUp.. 4");
        } else {
            console.log("In componentDidMount routine of SignUp.. 1.2");
            this.setState({isLoading: false})
        } 
    }
  
  render() {
        console.log("In render routine of SignUp - assign constant \
        [email, id] from state...");

        const email = this.state.email;
        //console.log("In render routine of SignUp - assigned email...");
        
        const id = this.state.id;
        console.log("In render routine of SignUp - assigned id...", id);
        
        if (id != "") { 
            console.log("In render routine of SignUp - redirecting user to parent...");
            return(
                <Redirect to={`/parent/${email}`} />
            )
        }
        
        // else {
            return(
                <div>
                    {(this.state.isLoading) ? 
                    <div>Loading..</div> :      
                    <div class={"row", "ml-3"}>
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
                                <select name="resState" onChange={this.handleChange}>
                                    <option value="CA">CA</option>
                                    <option value="CA">MA</option>                                
                                    <option value="CA">NY</option>
                                </select>
                                {/* <input 
                                    name="resState" 
                                    type="text"
                                    value = {this.state.resState}
                                    onChange={this.handleChange} /> */}
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
                    }
                </div>
            );
        // }
}

}