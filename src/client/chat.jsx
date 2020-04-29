import React from 'react';

export class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            msgText: "",
            messages: [],
            errorMsg: ""
        };
    }

    componentDidMount() {

        let protocol = "ws:";
        if (window.location.protocol.toLowerCase() === "https:") {
            protocol = "wss:";
        }

        this.socket = new WebSocket(protocol + "//" + window.location.host + "/chat");

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
            const data = dto.data;

            if (topic === "all_messages") {
                this.setState({messages: data})
            }
            if (topic === "new_message") {
                this.onNewMessage(data)
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

    onNewMessage(message) {
        this.setState(state => ({
            messages: [message, ...state.messages]
        }));
    }

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

    submitMessage = () => {
        const msg = this.state.msgText;

        if (msg === "") {
            return;
        }

        const payload = {
            topic: 'new_chat_message',
            data: {message: msg}
        };
        const data = JSON.stringify(payload);
        this.socket.send(data);
        this.setState({msgText: ""});
    };

    onMsgTextChange = event => {
        this.setState({msgText: event.target.value});
    };

    renderMessage(message) {
        return (
            <tr key={"MSG_KEY_" + message.timestamp + message.userId + message + message}>
                <td>{message.timestamp}</td>
                <td>{message.userId}</td>
                <td>{message.message}</td>
            </tr>
        )
    };

    renderMessages() {
        return (
            <React.Fragment>
                <table>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>User</th>
                        <th>Message</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.messages.map((message) => this.renderMessage(message))}
                    </tbody>
                </table>
            </React.Fragment>
        )
    }

    render() {

        const user = this.props.user;
        const messages = this.state.messages;

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

        let content;
        if (!messages || messages.length < 1) {
            content = <p>No messages</p>
        } else {
            content = this.renderMessages()
        }

        return (
            <div className={"chat-container"}>
                <h2>Chat with other users:</h2>
                <div className={"form-container"}>
                    <div className={"form-part"}>
                        <p className={"form-subtitle"}>Message:</p>
                        <input
                            className={"form-input"}
                            id={"message-input"}
                            type={"text"}
                            value={this.state.msgText}
                            onChange={this.onMsgTextChange}
                            tabIndex={"0"}
                        />
                    </div>
                    <div className={"btn btn-m"}
                         id={"send-msg-btn"}
                         onClick={this.submitMessage}
                         tabIndex={"0"}>
                        Send message
                    </div>
                </div>
                {content}
            </div>
        );
    }
}