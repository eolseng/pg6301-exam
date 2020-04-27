import React from "react";
import {Link, Route} from 'react-router-dom';

import {Chat} from "./chat";

export class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    renderLoggedIn() {
        return (
            <Chat user={this.props.user}
                  fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}/>
        )
    }

    render() {

        const user = this.props.user;

        let content;
        if (user) {
            content = this.renderLoggedIn();
        } else {
            content = "";
        }

        return (
            <div>
                <h2>Welcome to the app!</h2>
                {content}
            </div>
        );
    }
}