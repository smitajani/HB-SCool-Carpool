
class SignUp extends React.Component {
  
    constructor(props) {
    console.log("Signup: Constructor")
    super(props);
    
    //Initial state of component
    this.state = {
        isLoading: false,
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
        if (event.target.name == "email")
            this.userExists();

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
        console.log(`Signup - In handleSubmit: ${this.state.email}`)
      
        //Check if the record exists
// Check if I need to remove this verification from Submit since it's handled in 'onChange' event.

        const data = this.userExists();
        console.log(`Signup - And my data is: ${data}`);
  
        const { errorMessage, email, parentId } = this.state;
        console.log(`Signup - errorMessage is ${errorMessage}`)
        console.log(`Signup - email is ${email}`)
        console.log(`Signup - parentId is ${parentId}`)

        if (errorMessage !== "") {
          alert(errorMessage);
          this.setState({errorMessage: ""});
      } else {
        console.log(`Signup - Going to insert record in Parent table..`) 
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
                      console.log(`Signup - email: ${email}`)
                      this.setState({id: data.id})
                      this.props.setParentDetails(data)
                  });
                  }
      }


  async userExists() {

    console.log("Signup - In userExists routine...");

    const email = this.state.email;
    console.log(`Signup - email: ${email}`)

    const fetch_URL = (`/api/parent/email=${email}`);
    console.log(`Signup - Fetch URL: ${fetch_URL}`);

    let res = await fetch(fetch_URL);
      
    if (res.ok) {
      let data = await res.json(); 
      if ((data != "[object Promise]") && (data != "")) {
          alert("You have an existing account, please login using your email/password")
          console.log("Signup - Existing account");
          console.log(`Signup - data: ${data}`)
          this.setState({errorMessage: "Existing account"});
          this.props.setParentDetails([data.email])
          return; 
      } 
      else if (data == "[object Promise]") {
        this.setState({errorMessage: "Loading.."});
        alert("Verifying..");
        return; 
      } else {
        console.log("Signup - User does not exist. New user, ok to signup!");
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
        console.log("Signup - In componentDidMount routine.. 1");

        let queryParam = "";
        if ((this.state.parentId != null) || (this.state.email != "")) {
            console.log("Signup - In componentDidMount routine.. 1.1");
            if (this.state.parentId != null) {
                console.log("Signup - In componentDidMount routine.. 1.1.1");
                queryParam = `id=${this.state.parentId}`;            
                console.log("In componentDidMount routine.. 1.1.1.1", queryParam);
            } else {
                console.log("Signup - In componentDidMount routine.. 1.1.2");
                queryParam = `email=${this.state.email}`;
                console.log("Signup - In componentDidMount routine.. 1.1.2.1", queryParam);
            }
            console.log("Signup - In componentDidMount routine.. 2", queryParam);
            const response = await fetch(`/api/parent/${queryParam}`);
            const userData = await response.json();
        
            console.log("Signup - In componentDidMount routine.. 3");
            this.setState({
                isLoading: false,
                parentId: userData.id,
                parentFname: userData.parentFname,
                parentLname: userData.parentLname,
                address1: userData.address1,
                address2: userData.address2,
                city: userData.city,
                resState: userData.resState,
                email: userData.email,
                zipcode: userData.zipcode
              });
              console.log("Signup - In componentDidMount routine.. 4");
        } else {
            console.log("Signup - In componentDidMount routine.. 1.2");
            this.setState({isLoading: false})
        } 
    }
  
  render() {
        console.log("Signup - In render routine - assign constant \
        [email, parentId] from state...");

        const email = this.state.email;
        const parentId = this.state.parentId;
        console.log("Signup -In render routine - assigned id...", parentId);
        
        if (parentId != null) { 
            console.log("Signup - In render routine - redirecting user to parent...");
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