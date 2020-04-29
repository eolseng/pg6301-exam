import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import {Home} from "./home";
import Header from "./header";
import {SignUp} from "./signup";
import {Login} from "./login";
import {Chat} from "./chat";
import {Cards} from "./cards";

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            userCount: 1,
            allCards: null
        };
    }

    componentDidMount() {
        this.fetchAndUpdateUserInfo();
        this.fetchAllCards();
    }

    fetchAllCards = async () => {

        const url = "/api/cards";

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
            const payload = await response.json();
            this.setState({allCards: payload});
        } else {
            this.setState({
                errorMsg: "Unknown error.\n" +
                    "Status Code: " + response.status
            });
        }
    };

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

        const user = this.state.user ? this.state.user : null;
        const userId = user ? user.id : null;

        let chat;
        if (user) {
            chat = <Chat user={user}/>
        }

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
                        <Route exact path={"/cards"}
                               render={props => <Cards {...props}
                                                       user={user}
                                                       allCards={this.state.allCards}
                                                       fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}/>}/>
                        <Route exact path={"/"}
                               render={props => <Home {...props}
                                                      user={user}
                                                      allCards={this.state.allCards}
                                                      fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}/>}/>
                        <Route component={this.notFound}/>
                    </Switch>
                    {chat}
                </div>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));