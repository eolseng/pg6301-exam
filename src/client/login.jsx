import React from "react";
import {withRouter} from "react-router-dom";

export class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: "",
            password: "",
            errorMsg: null
        }
    };

    onUserIdChange = event => {
        this.setState({userId: event.target.value, errorMsg: null});
    };

    onPasswordChange = event => {
        this.setState({password: event.target.value, errorMsg: null});
    };


    doLogIn = async () => {

        const {userId, password} = this.state;


        const url = "/api/login";

        let response;
        const payload = {userId: userId, password: password};
        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            this.setState({errorMsg: "Failed to connect to the server: " + error});
            return;
        }

        if (response.status === 204) {
            // Successful login
            this.setState({errorMsg: null});
            await this.props.fetchAndUpdateUserInfo();
            this.props.history.push("/");
        } else if (response.status === 401) {
            this.setState({errorMsg: "Invalid user name or password"});
        } else {
            this.setState({
                errorMsg: "Unknown error\n" +
                    "Status Code: " + response.status
            });
        }
    };

    render() {

        let error;
        if (this.state.errorMsg) {
            error = (
                <div className={"error-msg"}>
                    <p>ERROR: {this.state.errorMsg}</p>
                </div>
            )
        }

        return (
            <div className={"form-container"}>
                <div className={"form-title"}>Log in:</div>
                <div className={"form-part"}>
                    <p className={"form-subtitle"}>User name:</p>
                    <input
                        className={"form-input"}
                        id={"userId-input"}
                        type={"text"}
                        value={this.state.userId}
                        onChange={this.onUserIdChange}
                    />
                </div>
                <div className={"form-part"}>
                    <p className={"form-subtitle"}>Password:</p>
                    <input
                        className={"form-input"}
                        id={"password-input"}
                        type={"password"}
                        value={this.state.password}
                        onChange={this.onPasswordChange}
                    />
                </div>

                {error}

                <div className={"btn btn-m"}
                     id={"login-btn"}
                     onClick={this.doLogIn} 
                     tabIndex={"0"}>
                    LOG IN
                </div>
            </div>
        );
    }
}

export default withRouter(Login);