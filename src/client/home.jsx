import React from "react";
import {Link, Route} from 'react-router-dom';
import {Lootbox} from "./lootbox";
import {Cards} from "./cards";

export class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMsg: ""
        };
    }

    componentDidMount() {
        if (this.props.user) {
            this.props.fetchAndUpdateUserInfo();
        }
    }

    renderLoggedIn() {
        const user = this.props.user;

        return (
            <div>
                <div className={"profile-container"}>
                    <div className={"profile-info"}>User: {user.id}</div>
                    <div className={"profile-info"}>Lootboxes: {user.lootboxes}</div>
                    <div className={"profile-info"}>Cash: ${user.cash}</div>
                    <div className={"profile-info"}>Cards: {user.cardAmount}</div>
                </div>
                <Lootbox user={user} fetchAndUpdateUserInfo={this.props.fetchAndUpdateUserInfo}/>
                <Cards user={user} fetchAndUpdateUserInfo={this.props.fetchAndUpdateUserInfo}/>
            </div>

        )
    }

    render() {

        const user = this.props.user;

        let content;
        if (user) {
            content = this.renderLoggedIn();
        } else {
            content =
                <div>
                    <h1>Welcome to Schmidts Stinging Friends</h1>
                    <p>This is a Gacha-game based on 'The Schmidt Pain Index', developed by the entomologist Dr. Justin
                        Schmidts.</p>
                    <p>You purchase lootboxes containing cards and gather them all.</p>
                    <p>PS.: Don't get stung. Some of these insects really hurt!</p>
                    <h3>Please sign up or log in to start collecting cards! :)</h3>
                </div>
        }

        return (
            <div>
                {content}
            </div>
        );
    }
}