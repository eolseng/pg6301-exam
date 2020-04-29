import React from 'react';

export class Notifications extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifying: false,
            errorMsg: ""
        };
    }

    componentDidMount() {

        let protocol = "ws:";
        if (window.location.protocol.toLowerCase() === "https:") {
            protocol = "wss:";
        }

        this.socket = new WebSocket(protocol + "//" + window.location.host + "/notifications");

        this.socket.onmessage = (event) => {

            const dto = JSON.parse(event.data);

            if (!dto) {
                this.setState({errorMsg: "Invalid response from server"});
                return;
            }

            if (dto.error) {
                this.setState({errorMsg: dto.error});
                return;
            }

            const topic = dto.topic;

            if (topic === "new_lootbox") {
                this.onNewLootbox()
            }
        };

        this.socket.onclose = () => {
            this.setState({errorMsg: "Disconnected from Server."});
        };

        this.socket.onopen = () => {
            this.doLogInWebSocket();
        };
    }

    componentWillUnmount() {
        this.socket.close();
    }

    onNewLootbox = () => {
        this.setState({notifying: true});
        this.props.fetchAndUpdateUserInfo();

        setTimeout(this.hideNotification, 10000);
    };

    hideNotification = () => {
        this.setState({notifying: false})
    };

    async doLogInWebSocket() {

        const url = "/api/wstoken";

        let response;
        try {
            response = await fetch(url, {
                method: "post"
            });
        } catch (error) {
            this.setState({errorMsg: "Failed to connect to server: " + error});
            return;
        }

        if (response.status === 401) {
            this.setState({errorMsg: "Session has expired. Please log in again"});
            return;
        }
        if (response.status !== 201) {
            this.setState({errorMsg: "Error when connection to server:\nStatus code: " + response.status});
            return;
        }

        const payload = await response.json();
        payload.topic = 'login';

        this.socket.send(JSON.stringify(payload));

    };

    render() {

        const user = this.props.user;
        const notifying = this.state.notifying;

        if (!user) {
            return (
                <div>
                    <p>Please sign in to use the chat.</p>
                </div>
            )
        } else if (this.state.errorMsg) {
            return (
                <div className={"error-msg"}>
                    <p>ERROR: {this.state.errorMsg}</p>
                </div>
            )
        }

        if(!notifying) {
            return ""
        }

        return (
            <div className={"notification-bar"}>
                <div className={"notification-text"}>You just received a new lootbox! Go open it!</div>
            </div>
        )
    }
}