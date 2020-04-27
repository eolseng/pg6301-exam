import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import {Home} from "./home";
import Header from "./header";
import {SignUp} from "./signup";
import {Login} from "./login";
import {Chat} from "./chat";

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            userCount: 1
        };
    }

    componentDidMount() {
        this.fetchAndUpdateUserInfo();
    }

    fetchAndUpdateUserInfo = async () => {

        const url = "/api/user";

        let response;
        try {
            response = await fetch(url, {
                method: "get"
            });
        } catch (error) {
            this.setState({errorMsg: "Failed to connect to server: " + error});
            return;
        }

        if (response.status === 200) {
            // User is logged in
            const payload = await response.json();
            this.updateLoggedInUser(payload);
        } else if (response.status === 401) {
            // No logged in user
            this.updateLoggedInUser(null);
        } else {
            this.setState({
                errorMsg: "Unknown error.\n" +
                    "Status Code: " + response.status
            });
        }
    };

    updateLoggedInUser = (user) => {
        this.setState({user: user});
    };

    notFound() {
        return (
            <div>
                <h2>NOT FOUND: 404</h2>
                <p>ERROR: The document you requested is not available.</p>
            </div>
        )
    }

    render() {

        const userId = this.state.user ? this.state.user.id : null;

        return (
            <BrowserRouter>
                <Header userId={userId}
                        updateLoggedInUser={this.updateLoggedInUser}/>

                <div className={"content"}>
                    <Switch>
                        <Route exact path={"/login"}
                               render={props => <Login {...props}
                                                       fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}/>}/>
                        <Route exact path={"/signup"}
                               render={props => <SignUp {...props}
                                                        fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}/>}/>
                        <Route exact path={"/"}
                               render={props => <Home {...props}
                                                      user={this.state.user}
                                                      fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}/>}/>
                        <Route component={this.notFound}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));