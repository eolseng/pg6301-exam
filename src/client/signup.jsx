import React from "react";
import {withRouter} from "react-router-dom";

export class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: "",
            password: "",
            confirmPassword: "",
            errorMsg: null
        }
    };

    onUserIdChange = event => {
        this.setState({userId: event.target.value, errorMsg: null});
    };

    onPasswordChange = event => {
        this.setState({password: event.target.value, errorMsg: null});
    };

    onConfirmPasswordChange = event => {
        this.setState({confirmPassword: event.target.value, errorMsg: null});
    };

    doSignUp = async () => {

        const {userId, password, confirmPassword} = this.state;

        if (password !== confirmPassword) {
            this.setState({errorMsg: "Passwords do not match."});
            return;
        }

        const url = "/api/signup";

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

        if (response.status === 201) {
            // Successful signup of new user
            this.setState({errorMsg: null});
            await this.props.fetchAndUpdateUserInfo();
            this.props.history.push("/");
        } else if (response.status === 400) {
            this.setState({errorMsg: "Invalid username or password"});
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

        let confirmMsg = "Passwords match! Good job!";
        if (this.state.password !== this.state.confirmPassword) {
            confirmMsg = "Passwords do not match."
        } else if (!this.state.password) {
            confirmMsg = "";
        }
        
        return (
            <div className={"form-container"}>
                <div className={"form-title"}>Sign up:</div>
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
                <div className={"form-part"}>
                    <p className={"form-subtitle"}>Confirm password:</p>
                    <input
                        className={"form-input"}
                        id={"confirmPassword-input"}
                        type={"password"}
                        value={this.state.confirmPassword}
                        onChange={this.onConfirmPasswordChange}
                    />
                    <p className={"confirm-msg"}>{confirmMsg}</p>
                </div>

                {error}

                <div
                    className={"btn btn-m"}
                    id={"signup-btn"}
                    onClick={this.doSignUp}
                    tabIndex={"0"}>
                    SIGN UP
                </div>
            </div>
        );
    }
}

export default withRouter(SignUp);