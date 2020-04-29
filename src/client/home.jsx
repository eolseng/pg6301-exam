import React from "react";
import {Link, withRouter} from 'react-router-dom';
import {Lootbox} from "./lootbox";
import {StatusBar} from "./status-bar";

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
            <React.Fragment>
                <StatusBar user={user} allCards={this.props.allCards}/>
                <Lootbox user={user} fetchAndUpdateUserInfo={this.props.fetchAndUpdateUserInfo}/>
                <h2>You have {user.cardAmount} cards.</h2>
                <Link
                    to={"/cards"}>
                    <div className={"btn btn-m"}
                         id={"collection-btn"}>
                        View my cards
                    </div>
                </Link>
            </React.Fragment>
        )
    }

    render() {

        const user = this.props.user;

        let content;
        if (user) {
            content = this.renderLoggedIn();
        } else {
            content =
                <React.Fragment>
                    <h1>Welcome to Schmidts Stinging Friends</h1>
                    <p>This is a Gacha-game based on 'The Schmidt Pain Index', developed by the entomologist Dr. Justin
                        Schmidts.</p>
                    <p>You purchase lootboxes containing cards and gather them all.</p>
                    <Link
                        to={"/cards"}>
                        <div className={"btn btn-m"}
                             id={"collection-btn"}>
                            See all our fantastic cards
                        </div>
                    </Link>
                    <p>PS.: Don't get stung. Some of these insects really hurt!</p>
                    <h3>Please sign up or log in to start collecting cards! :)</h3>
                    <div>
                        <Link className={"btn btn-m btn-cta"} id={"signup-btn"} to={"/signup"} tabIndex={"0"}>
                            SIGN UP
                        </Link>
                        <Link className={"btn btn-m"} id={"login-btn"} to={"/login"} tabIndex={"0"}>
                            LOG IN
                        </Link>
                    </div>
                </React.Fragment>
        }
        return content
    }
}

export default withRouter(Home);