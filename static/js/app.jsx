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


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: "",
      parentId: sessionStorage.getItem('parentId'), 
      // path: '/'
    };
    this.setParentDetails = this.setParentDetails.bind(this);
    this.handleChange = this.handleChange.bind(this)
  }

  setParentDetails(data) {
    let parentId, email;
    [parentId, email] = data;
    sessionStorage.setItem('parentId', parentId);
    sessionStorage.setItem('email', email);
    this.setState({ parentId: parentId,
                    email: email 
                  });
  }


  //Handle Change event 
  handleChange = event => {
      this.setState({ [event.target.name] : event.target.value})
   }

  render() {
    return (  
      <div>
        <Router>
          <Switch>
              <Route>
                { (this.state.parentId) ?
                  <ParentInfo path="/api/parent/" /> :
                  <Login path="/" />
                } 
              </Route>
              <Route path="/signup">
                 <SignUp />
              </Route>
          </Switch>
      </Router>
    </div>
    )
  }

}

ReactDOM.render(<App />, document.querySelector('#app'));


// ReactDOM.render(<Router History={hashHistory}>
//   <Switch>
//           <Route exact path="/" component={App} />
          
//           <Route path="/signup" component={SignUp} />

//   </Switch>
// </Router>, document.getElementById('app'));


// Verify if depricated before delteing
// <Route path="/api/parent/:id" component={SignUp} />
// <Route path="/api/parent/add" component={SignUp} />
// <Route path="/api/parent/" component={SignUp} />
