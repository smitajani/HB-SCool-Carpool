"use strict";

class Login extends React.Component {

  constructor(props) {
    super(props);
    
    //Initial state of component
    this.state = {
        isLoading: true,
        errorMessage: "",
        
        email: this.props.email,
        parentId: this.props.parentId,
        zipcode: this.props.zipcode
        
    };
    
    console.log(`Login.jsx: constructor (email & parentId) - ${this.state.email}, ${this.state.parentId}`);
    
    //console.log(`In constructor of login app 3. - ${this.email}, ${this.parentId}`); - Both show as undefined.
       

    // Required binding to make `this` work in the callback
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.userExists = this.userExists.bind(this);
  }

  //Handle Change event 
  handleChange = event => {
    console.log("Login.jsx: In handleChange routine...");
    this.setState({ [event.target.name] : event.target.value})
  }

  async userExists() {

    console.log("Login.jsx: In userExists routine...");

    const email = this.state.email;
    console.log(`Login.jsx: (email) ${email}`)

    const fetch_URL = (`/api/parent/email=${email}`);
    console.log(`Login.jsx: Fetch URL: ${fetch_URL}`);

    let res = await fetch(fetch_URL);
      
    if (res.ok) {
      let data = await res.json(); 
      if ((data != "[object Promise]") && (data != "")) {
          // alert("You have logged in successfully");
          console.log("You have logged in successfully");
          console.log(`Login.jsx: (data) ${data}`);

          this.setState({
            isLoading: false,
            errorMessage: "",
            zipcode: data.zipcode
          });

          this.props.setParentDetails([data.id, data.email, data.zipcode])
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
      console.log("Login.jsx: In handleSubmit routine...");
      event.preventDefault();
      console.log(`Login.jsx: (email): ${this.state.email}`)
      
      //Check if the record exists
      const data = this.userExists();
      console.log(`Login.jsx: And my data is: ${data}`);

      const { errorMessage, email, parentId, zipcode} = this.state;
      console.log(`Login.jsx: (errorMessage, email, parentId, zipcode) --/  ${errorMessage} --/ ${email} --/ ${parentId} --/ ${zipcode} --`)
      
      if (errorMessage !== "") {
          alert(errorMessage);
          this.setState({errorMessage: ""});
      }
  }

  render() { 
        console.log("Login.jsx: In render routine (email, parentId, zipcode --/", this.state.email, "--/",
        this.state.parentId, "--/", this.state.zipcode, "--");

        if (this.state.parentId != null) { 
            console.log("Login.jsx: In render routine - redirecting user to parent...");
            return(
                <Redirect to={`/parent/${this.state.parentId}`}  email={this.state.email} parentId={this.state.parentId} zipcode={this.state.zipcode} />
            )
        }
        else {
          console.log("Login.jsx: In render routine - displaying the form...");  
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