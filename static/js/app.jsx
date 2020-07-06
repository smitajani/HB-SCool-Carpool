"use strict";

mapboxgl.accessToken = 'pk.eyJ1Ijoic2phbmkiLCJhIjoiY2tic2NvNGk2MDBiODJ4b3E3ajk4MmtuOSJ9.1FkGDgGkzek4mb8hHbsJGA'

const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;
const IndexRoute = window.ReactRouter.BrowserRouter;
const hashHistory = window.ReactRouter.BrowserRouter;
const useLocation = window.ReactRouterDOM.useLocation;
const useRouteMatch = window.ReactRouterDOM.useRouteMatch;
const browserHistory = window.ReactRouter;
const useParams = window.ReactRouterDOM.useParams;


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: "",
      parentId: sessionStorage.getItem('parentId'), 
      email: this.props.email,
      path: '/',
      zipcode: this.props.zipcode
    };

    this.setParentDetails = this.setParentDetails.bind(this);
    this.getParentDetails = this.getParentDetails.bind(this);
    this.handleChange = this.handleChange.bind(this)
    this.logout = this.logout.bind(this)

    console.log("App.jsx: constructor")
  }

  setParentDetails(data) {
    let parentId, email, zipcode;
    [parentId, email, zipcode] = data;
    console.log(`App.jsx: In setParentDetails parentId, email, zipcode --/  ${parentId} --/ ${email} --/ ${zipcode} --`)
    sessionStorage.setItem('parentId', parentId);
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('zipcode', zipcode);
    this.setState({ parentId: parentId,
                    email: email, 
                    zipcode: zipcode
                  });
  }

  getParentDetails(){
    const pathname = window.location.pathname;
    const parentId = pathname.substring(pathname.lastIndexOf('/')+1);
    return parentId; 
  }

  logout() {
    this.setState({parentId: ""});
    sessionStorage.clear()
}

  //Handle Change event 
  handleChange = event => {
      this.setState({ [event.target.name] : event.target.value})
   }

  //TODO GLOBAL - Replace all javascript alerts with error message (self disappearing) divs in all classes
  //TODO GLOBAL - Clean-up unnecessary state variables in all classes & use props instead
  //TODO GLOBAL - Include proper error handling everywhere and ensure all corner cases also work properly & not just the happy path

  render() {
    console.log("App.jsx: In 'render' routine (email, parentId, zipcode --/", 
    this.state.email, "--/", 
    this.state.parentId, "--/", 
    this.state.zipcode);

    return (  
      <div>
        <Router history={browserHistory}>
          <Switch>
            <Route path='/parent/:id'>
                {/* <ParentInfo email={this.state.email} parentId={this.state.parentId} zipcode={this.state.zipcode} /> */}
                <ParentInfo email={this.state.email} 
                  parentId={this.state.parentId} 
                  zipcode={this.state.zipcode} 
                  logout={this.logout}/>    
            </Route> 

            <Route path='/signup'>
              <SignUp setParentDetails={this.setParentDetails} 
                email={this.state.email} 
                parentId={this.state.parentId} 
                zipcode={this.state.zipcode} />
              </Route>

            <Route path='/'>
              {(this.state.parentId != undefined && this.state.parentId != "") ?
                <Redirect to={`/parent/${this.state.parentId}`} 
                  email={this.state.email}  
                  parentId={this.state.parentId}
                  zipcode={this.state.zipcode} /> :
                
                <Login setParentDetails={this.setParentDetails} />
              }
              </Route>
          </Switch>
      </Router>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));