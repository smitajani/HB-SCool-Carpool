"use strict";


class ManageAccount extends React.Component {

  constructor(props) {
    super(props);
    
    //Initial state of component
    this.state = {
        email: "",
        parentId: "",
        isLoaded: false
    };
    
    // Required binding to make `this` work in the callback
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.userExists = this.userExists.bind(this);
  }

  //Handle Change event 
  handleChange(event) {

      const target = event.target;
      const value = target.value;
      const name =  target.name;

      this.setState({
          [name]: value
      });

  }

  handleSubmit(event) {
      event.preventDefault();
      //Validate the values entered and send request to backend in success 
      //this.ValidateParent();

      //Check if the record exists 
      this.userExists()
  }

  userExists() {
    fetch('/parent')
      .then(response => {
        return response.json();
      })
      .then(data => {
        alert(`Data fetched is ${data}`);
      });
  }

  render() {
      return (<div id="container">
              <h5>Manage your account</h5>
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

    
         </div>
      );
    }

}  
  

// ReactDOM.render(<ManageAccount />, document.getElementById('app'));
