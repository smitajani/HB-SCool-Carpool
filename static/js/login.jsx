"use strict";

class Login extends React.Component{
    constructor(props) {
        super(props);

    }


render() {
    return(<div id="container">

            <div id="showerror" class="row">
                <div col="col-9">
                    {/* <textarea name="errorMessage" value={this.state.value} onChange={this.handleChange} /> */}
                </div>
            </div>

            <div id="accountinfo" class="row">
                <div class="col-9">
                    <ManageAccount /><br /><br />
                    <h5>Don't have an account? 
                        <Link to="/signup"> Signup here</Link>
                    </h5>
                </div>
            </div>

            </div>
        );
}
}

