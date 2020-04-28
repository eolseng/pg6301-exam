import React from "react";

export class Cards extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cards: [],
            errorMsg: ""
        };
    }

    componentDidMount() {
        this.fetchCards();
    }

    fetchCards = async () => {
        const url = '/api/user/cards';

        let response;
        try {
            response = await fetch(url, {
                method: "get"
            });
        } catch (error) {
            this.setState({errorMsg: "Failed to connect to server: " + error});
            return;
        }

        if (response.status === 401) {
            this.setState({errorMsg: "The session has expired. Please log in again."});
            return;
        } else if (response.status !== 200) {
            this.setState({errorMsg: "Error when connection to server:\nStatus code: " + response.status});
            return;
        }

        const cards = await response.json();

        this.setState({cards: cards});

    };

    renderCards() {
        const cards = this.state.cards;

        if (cards.length <= 0){
            return "";
        }

        return <div className={"cards-container"}>
            {this.state.cards.map((card) => this.renderCard(card))}
        </div>
    }

    renderCard(card) {
        return <div className={"card-container"} key={"KEY_CARD_" + card.id}>
            <div className={"card-name"}>{card.card.name}</div>
            <div className={"card-latin-name"}>{card.card.latinName}</div>
            <div className={"card-pain-level"}>Pain level: {card.card.painLevel}</div>
            <div className={"card-description"}>{card.card.description}</div>
            <div className={"card-value"}>Value: ${card.card.value}</div>
            <div className={"card-amount"}>You have {card.amount} of this card.</div>
        </div>
    }

    render() {

        const user = this.props.user;

        let content;

        if (!user) {
            content = "";
        } else {
            if (this.state.cards.length <= 0) {
                content =
                    <h2>You do not have any cards. Please open or purchase a lootbox!</h2>
            } else {
                content =
                    <div className={"cards-container"}>
                        <h2>You have {this.state.cards.length} cards!</h2>
                        {this.renderCards()}
                    </div>
            }
        }

        return content;
    }
}