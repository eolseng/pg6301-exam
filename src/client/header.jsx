import React from 'react';
import {Link, withRouter} from 'react-router-dom';

export class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    doLogout = async () => {
        const url = "/api/logout";

        let response;
        try {
            response = await fetch(url, {method: "post"});
        } catch (error) {
            alert("Could not log out:\n" + error);
            return;
        }

        if (response.status === 204) {
            this.props.updateLoggedInUser(null);
            this.props.history.push("/");
        } else {
            alert("Error when connection to server\n" +
                "Status code: " + response.status);
        }
    };

    renderNotLoggedIn() {
        return (
            <React.Fragment>
                <div>
                    <Link className={"btn btn-m btn-cta"} id={"signup-btn"} to={"/signup"} tabIndex={"0"}>
                        SIGN UP
                    </Link>
                    <Link className={"btn btn-m"} id={"login-btn"} to={"/login"} tabIndex={"0"}>
                        LOG IN
                    </Link>
                </div>
            </React.Fragment>
        );
    }

    renderLoggedIn(userId) {
        return (
            <React.Fragment>
                <div className={"header-text"}>Welcome, {userId}</div>
                <Link
                    className={"btn btn-m"}
                    id={"logout-btn"}
                    onClick={this.doLogout}
                    to={"/"}>
                    LOG OUT
                </Link>
            </React.Fragment>
        );
    }

    render() {

        const userId = this.props.userId;

        let content;
        if (userId) {
            content = this.renderLoggedIn(userId);
        } else {
            content = this.renderNotLoggedIn();
        }

        return (
            <div className={"header"}>
                <Link className={"header-logo"} to={"/"}>Schmidts Stinging Friends</Link>
                {content}
            </div>
        );
    }
}

export default withRouter(Header);
