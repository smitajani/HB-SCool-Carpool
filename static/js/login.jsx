"use strict";

class Login extends React.Component {

  constructor(props) {
    console.log("Login constructor")
    super(props);
    
    //Initial state of component
    this.state = {
        isLoading: true,
        errorMessage: "",
        
        email: this.props.email,
        parentId: this.props.parentId,
        
    };
    
    console.log(`In constructor of login app 2. - ${this.state.email}, ${this.state.parentId}`);
    
    //console.log(`In constructor of login app 3. - ${this.email}, ${this.parentId}`); - Both show as undefined.
       

    // Required binding to make `this` work in the callback
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.userExists = this.userExists.bind(this);
  }

  //Handle Change event 
  handleChange = event => {
    console.log("Login - In handleChange routine...");
    this.setState({ [event.target.name] : event.target.value})
  }

  async userExists() {

    console.log("Login - In userExists routine...");

    const email = this.state.email;
    console.log(`Login - email: ${email}`)

    const fetch_URL = (`/api/parent/email=${email}`);
    console.log(`Login - Fetch URL: ${fetch_URL}`);

    let res = await fetch(fetch_URL);
      
    if (res.ok) {
      let data = await res.json(); 
      if ((data != "[object Promise]") && (data != "")) {
          // alert("You have logged in successfully");
          console.log("You have logged in successfully");
          console.log(`Login - data: ${data}`);
          this.props.setParentDetails([data.id,data.email])
          return data;
      } 
      else if (data == "[object Promise]") {
        this.setState({errorMessage: "Loading.."});
        alert("Loading data..");
        return; 
      } else {
        alert("User does not exist...")
        this.setState({errorMessage: "Did you sign up yet?"});
        return;
      }
    } else {
      alert("HTTP-Error: " + res.status);
      this.setState({errorMessage: "Hmm! Something is not right - It's not you, it's us!"});
      return;
    }
      
  }


  handleSubmit(event) {
      console.log("Login - In handleSubmit routine...");
      event.preventDefault();
      console.log(`Login - email: ${this.state.email}`)
      
      //Check if the record exists
      const data = this.userExists();
      console.log(`Login - ..And my data is: ${data}`);

      const { errorMessage, email, parentId} = this.state;
      console.log(`Login - errorMessage is ${errorMessage}`)
      console.log(`Login - email is ${email}`)
      console.log(`Login - parentId is ${parentId}`)
      
      if (errorMessage !== "") {
          alert(errorMessage);
          this.setState({errorMessage: ""});
      }
  }

  render() { 
        console.log("Login - In render routine...", this.state.email, "--", this.state.parentId, "--");

        if (this.state.parentId != null) { 
            console.log("Login - In render routine - redirecting user to parent...");
            return(
                <Redirect to={`/parent/${this.state.parentId}`} />
            )
        }
        else {
          console.log("Login - In render routine - displaying the form...");  
          return (
              <div id="container">
                  <div id="showerror" class={"row", "ml-3"}>
                      <div class="col">
                          {/* <textarea name="errorMessage" value={this.state.value} onChange={this.handleChange} /> */}
                      </div>
                  </div>

                  <div id="accountinfo" class={"row", "ml-3"}>
                    <div class="col">
                        <h5>Login</h5>
                          <form onSubmit={this.handleSubmit}>
                              <label>
                                  Email: 
                                  <input 
                                      name="email" 
                                      type="text" 
                                      value={this.state.email}
                                      onChange={this.handleChange} />
                              </label>
                              <br />

                              <label>
                                  Password: 
                                  <input 
                                      name="password" 
                                      type="text" 
                                      value ={this.state.password}
                                      onChange={this.handleChange} />
                              </label>
                              <br />
                          
                              <button>Login</button>
                          </form>
                          <br /><br />

                          <h5>Don't have an account? 
                              <Link to="/signup"> Signup here</Link>
                          </h5>

                          {/* <a href="/signup">signup here (anchor tag)..</a> */}
                      </div>
                  </div>

                </div>

            );
    }
  }  

}