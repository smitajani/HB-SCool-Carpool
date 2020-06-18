"use strict";

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
      email: "",
      path: '/'
    };

    this.setParentDetails = this.setParentDetails.bind(this);
    this.getParentDetails = this.getParentDetails.bind(this);
    this.handleChange = this.handleChange.bind(this)
  }

  setParentDetails(data) {
    let parentId, email;
    [parentId, email] = data;
    console.log(`App: In setParentDetails - ${parentId} - ${email} `)
    sessionStorage.setItem('parentId', parentId);
    sessionStorage.setItem('email', email);
    this.setState({ parentId: parentId,
                    email: email 
                  });
  }

  getParentDetails(){
    const pathname = window.location.pathname;
    const parentId = pathname.substring(pathname.lastIndexOf('/')+1);
    return parentId; 
  }


  //Handle Change event 
  handleChange = event => {
      this.setState({ [event.target.name] : event.target.value})
   }

  render() {
    console.log("App: In 'render' routine..", this.state.email, "--", this.state.parentId);
    return (  
      <div>
        <Router history={browserHistory}>
          <Switch>
            <Route path='/parent/:id'><ParentInfo email={this.state.email} parentId={this.state.parentId} /></Route> 
            <Route path='/signup'><SignUp setParentDetails={this.setParentDetails} email={this.state.email} parentId={this.state.parentId} /></Route>
            <Route path='/'>
              {(this.state.parentId) ?
                <Redirect to={`/parent/${this.state.parentId}`} /> :
                <Login setParentDetails={this.setParentDetails} email={this.state.email} parentId={this.state.parentId} />
              }
              </Route>
          </Switch>
      </Router>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));