"use strict";

class ParentInfo extends React.Component {
    constructor(props) {
        super(props);
        
    
        //Initial state of component
        this.state = {
            isLoading: true,
            errorMessage: "",
            parentId: "",
        };

            const {email} = this.state
            console.log(email)    
    
            // Required binding to make `this` work in the callback
            // this.handleChange = this.handleChange.bind(this)
            this.handleSubmit = this.handleSubmit.bind(this)
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


        handleSubmit(event) {
            event.preventDefault();
            //Validate the values entered and send request to backend in success 
            //this.ValidateParent();

            //Check if the record exists 
            // this.userExists()
        }

  render() {
      return (
          <div>
              <h5>Parent Information</h5>
              {/* <form onSubmit={this.handleSubmit}>
                  <label>
                      Email: 
                      <input 
                          name="email" 
                          type="text" 
                          value={this.props.email}
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
              </form> */}
          </div>
      );
  }


  // componentDidMount() {
  //   $.get('/api/parent', (result) => {
  //     this.setState({ userinfo: result, isLoaded: true });
  //   });
  // }
}  
  

// ReactDOM.render(<ManageAccount />, document.getElementById('app'));
