import React from "react";

export class Lootbox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            newCards: [],
            errorMsg: ""
        };
    }

    openLootbox = async () => {

        const url = '/api/lootbox/open';

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
            this.setState({errorMsg: "The session has expired. Please log in again."});
            return;
        } else if (response.status === 400) {
            this.setState({errorMsg: "You have no lootboxes to open."});
            return;
        } else if (response.status !== 202) {
            this.setState({errorMsg: "Error when connection to server:\nStatus code: " + response.status});
            return;
        }

        const newCards = await response.json();
        this.setState({errorMsg: null, newCards: newCards});
        await this.props.fetchAndUpdateUserInfo();
    };

    purchaseLootbox = async () => {

        const url = '/api/lootbox/purchase';

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
            this.setState({errorMsg: "The session has expired. Please log in again."});
            return;
        } else if (response.status === 400) {
            this.setState({errorMsg: "Not enough cash to purchase another lootbox."});
            return;
        } else if (response.status !== 204) {
            this.setState({errorMsg: "Error when connection to server:\nStatus code: " + response.status});
            return;
        }

        this.setState({errorMsg: null});
        await this.props.fetchAndUpdateUserInfo();

    };

    renderCards() {
        const cards = this.state.newCards;
        return <div className={"cards-container"}>
            {cards.map((card, index) => this.renderCard(card, index))}
        </div>
    }

    renderCard(card, index) {
        return <div className={"card-container new-card"} key={"KEY_NEW_CARD_" + card.id + "_" + index}>
            <div className={"card-name"}>{card.name}</div>
            <div className={"card-latin-name"}>{card.latinName}</div>
            <div className={"card-pain-level"}>Pain level: {card.painLevel}</div>
            <div className={"card-description"}>{card.description}</div>
            <div className={"card-value"}>Value: ${card.value}</div>
        </div>
    }

    renderButtons(user) {

        let openButton = "";
        if (user.lootboxes > 0) {
            openButton = <div
                className={"btn btn-m"}
                id={"lootbox-open-btn"}
                onClick={this.openLootbox}>
                Open a lootbox!
            </div>
        }

        let purchaseButton;
        if (user.cash >= 500) {
            purchaseButton = <div
                className={"btn btn-m"}
                id={"lootbox-purchase-btn"}
                onClick={this.purchaseLootbox}>
                Purchase a lootbox for $500!
            </div>
        } else {
            purchaseButton = <div
                className={"btn btn-m inactive-btn"}
                id={"lootbox-purchase-btn"}
                >
                Need more cash to purchase lootboxes!
            </div>
        }

        return <div>
            {purchaseButton}
            {openButton}
        </div>
    }

    render() {

        const user = this.props.user;
        const errorMsg = this.state.errorMsg;

        let error;
        if (errorMsg) {
            error = <div className={"error-msg"}>Error: {errorMsg}</div>;
        }

        let content;
        if (!user) {
            content = "";
        } else if (this.state.newCards.length > 0) {
            content =
                <div className={"lootbox-container"}>
                    <h2>You have {user.lootboxes} unopened lootboxes</h2>
                    {error}
                    {this.renderButtons(user)}
                    <h2>Congratulations! Here are your new cards:</h2>
                    {this.renderCards()}
                </div>
        } else {
            content =
                <div className={"lootbox-container"}>
                    <h2>You have {user.lootboxes} unopened lootboxes</h2>
                    {error}
                    {this.renderButtons(user)}
                </div>
        }

        return content;

    }
}