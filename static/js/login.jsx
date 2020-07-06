"use strict";

class Login extends React.Component {

  constructor(props) {
    console.log("Login constructor")
    super(props);
    
    //Initial state of component
    this.state = {
        isLoading: true,
        errorMessage: "",
        email: "",
        parentId: "",
        zipcode: "",
        password: ""
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

    const {email, password} = this.state;
    console.log(`Login.jsx: (email) ${email}`)

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }

    console.log("Login.jsx: requestOptions", requestOptions, "--");
    
    await fetch('/api/parent/login', requestOptions)
    .then(res => res.json())
    .then(data => {
      console.log("Login.jsx: userExists() - parentData, ", data);
      if (data == "Invalid") {
        this.setState({errorMessage: "Please specify valid email / passowrd"})
        return;
      }
      else {
        console.log("Login.jsx: userExists() - User logged in successfully");
        this.setState({
          isLoading: false,
          errorMessage: "",
          zipcode: data.zipcode
        });
        this.props.setParentDetails([data.id, data.email, data.zipcode])
        return data;
      }
    });
    return;
  }

  handleSubmit(event) {
      console.log("Login.jsx: In handleSubmit routine...");
      event.preventDefault();
      this.setState({errorMessage: ""})

      const { errorMessage, email, parentId, zipcode, password} = this.state;

      console.log(`Login.jsx: (email): ${email}`)
      
      if (email == "" || password == "") {
        this.setState({errorMessage: "Please enter email & password to login"})
        return;
      }
      
      //Check if the record exists
      const data = this.userExists();
      console.log(`Login.jsx: And my data is: ${data}`);

      console.log(`Login.jsx: (errorMessage, email, parentId, zipcode) --/  ${errorMessage} --/ ${email} --/ ${parentId} --/ ${zipcode} --`)
      
  }

  render() { 
        console.log("Login.jsx: In render routine (email, parentId, zipcode --/", this.state.email, "--/",
        this.state.parentId, "--/", this.state.zipcode, "--");

        if (this.state.parentId != "") { 
            console.log("Login.jsx: In render routine - redirecting user to parent...");
            return(
                <Redirect to={`/parent/${this.state.parentId}`}  
                  email={this.state.email} 
                  parentId={this.state.parentId} 
                  zipcode={this.state.zipcode} />
            )
        }
        else {
          console.log("Login.jsx: In render routine - displaying the form...");  
          return (
              <div id="container app-bg">
                  {/* <div id="showerror" class={"row", "ml-3"}>
                      <div class="col">
                          <textarea name="errorMessage" value={this.state.value} onChange={this.handleChange} />
                      </div>
                  </div> */}
                  <div class="row ml-3">
                    <section class="col-xs-6 col-sm-6 col-md-3 col-lg-3 right">
                      <div>
                        <br />
                        <form onSubmit={this.handleSubmit}>
                          <table>
                            <thead><tr>
                              <th colSpan="2"><h5>Account Login</h5><br />
                              {this.state.errorMessage ? 
                              <div class="alert alert-danger" role="alert">
                                  {this.state.errorMessage}
                                </div>
                              :""}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              <tr class="input-td">
                              <td>Email: </td>
                              <td><input 
                                    name="email" 
                                    type="text" 
                                    class="custom-input" 
                                    placeholder="Your email"
                                    value={this.state.email}
                                    onChange={this.handleChange} />                            
                              </td>
                              </tr>

                              <tr class="input-td">
                                <td>Password: </td>
                                <td><input 
                                      name="password" 
                                      type="password" 
                                      class="custom-input" 
                                      placeholder="Your password"
                                      value ={this.state.password}
                                      onChange={this.handleChange} />
                                </td>
                              </tr>
                              <tr style={{textAlign: 'center'}}>
                                <td>
                                  <br /><br />
                                  <button class="btn custom-button-1">Login</button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </form>
                        <br />
                        <span ><h6>Don't have an account? <Link to="/signup" class="line-wipe">Signup here</Link>
                        </h6></span>
                      </div>  
                    </section>
                    {/* <section class="col-1 left">
                      <h4> </h4>
                    </section> */}
                    <section class="col-xs-10 col-sm-10 col-md-7 col-lg-7 left">
                      {/* <div class="media">
                          <img class="mr-3" src="/static/img/carpool.jpg" width="320px" height="200px" alt="Kids Carpool" />
                          <div class="media-body">
                            <h5 class="mt-0">Carpooling kids to school</h5>
                                      Daily commutes to & from school become fun with buddies
                            <div class="media mt-3">
                                <img class="mr-3" src="/static/img/soccercarpool.jpg" width="320px" height="200px" alt="After-school Activities & Sports" />
                                <div class="media-body">
                                  <h5 class="mt-0">After-school Activities & Sports</h5>
                                  Taking kids to regular activities, practices & games does not feel like a chore
                                  <div class="media mt-3">
                                      <img class="mr-3" src="/static/img/legocamp.jpg"  width="320px" height="200px" alt="Holiday Camps & Events" />
                                      <div class="media-body">
                                        <h5 class="mt-0">Holiday Camps & Events</h5>
                                        Find other parents in the trust circle with kids going to the same camps & events
                                      </div>
                                  </div>
                                </div>
                            </div>
                          </div>
                      </div> */}
                      <div class="media-body">
                          {/* <div class="media-body"> */}
                          <img class="media body-img" src="/static/img/SCarpoolfullImage.png" width="500px" height="460px" alt="Kids Carpool"/> 
                            {/* <h5 class="mt-0">Carpooling kids to school</h5>
                            <div class="media mt-3">
                                <div class="media-body">
                                  <h5 class="mt-0">After-school Activities & Sports</h5>
                                  <div class="media mt-3">
                                      <img class="rounded-circle" src="/static/img/legocamp.jpg"  width="280px" height="200px" alt="Holiday Camps & Events" />
                                      <img class="rounded-circle" src="/static/img/activities.png"  width="280px" height="200px" alt="Holiday Camps & Events" />
                                      <div class="media-body">
                                        <h5 class="mt-0">Holiday Camps & Events</h5>
                                      </div>
                                  </div>
                                </div> 
                            </div>*/}
                          {/* </div> */}
                      </div>
                      {/* <img class="media" src="/static/img/Family-happythoughts.jpg" width="280px" height="200px" alt="Kids Carpool" /> */}
                    </section>
                    {/* <section class="col-xs-10 col-sm-10 col-md-5 col-lg-5 body-img">
                    
                    </section> */}
                 </div>
              </div>
            );
    }
  }  

}