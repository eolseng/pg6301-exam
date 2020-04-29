import React from "react";
import {withRouter, Link} from "react-router-dom";

export class Cards extends React.Component {
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

    millCard = async (id) => {

        const url = '/api/user/cards/' + id + '/mill';

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
            this.setState({errorMsg: "You do not have this card. Milling failed"});
            return;
        } else if (response.status !== 204) {
            this.setState({errorMsg: "Error when connection to server:\nStatus code: " + response.status});
            return;
        }

        await this.props.fetchAndUpdateUserInfo();

    };

    getMissing(ownedCards, allCards) {

        let missingCards = [];
        allCards.forEach(card => {
            if (!ownedCards.some(owned => owned.id === card.id)) {
                missingCards.push(card);
            }
        });
        return this.renderCards(missingCards);
    }

    renderCards(cards) {

        if (!cards || cards.length <= 0) {
            return "";
        }

        return <div className={"cards-container"}>
            {cards.map((card) => this.renderCard(card))}
        </div>
    }

    renderCard(card) {
        if (!card.amount) {
            return <div className={"card-container"} key={"KEY_CARD_" + card.id}>
                <div className={"card-name"}>{card.name}</div>
                <div className={"card-latin-name"}>{card.latinName}</div>
                <div className={"card-pain-level"}>Pain level: {card.painLevel}</div>
                <div className={"card-description"}>{card.description}</div>
                <div className={"card-value"}>Value: ${card.value}</div>
            </div>
        } else {
            return <div className={"card-container"} key={"KEY_CARD_" + card.id}>
                <div className={"card-name"}>{card.card.name}</div>
                <div className={"card-latin-name"}>{card.card.latinName}</div>
                <div className={"card-pain-level"}>Pain level: {card.card.painLevel}</div>
                <div className={"card-description"}>{card.card.description}</div>
                <div className={"card-value"}>Value: ${card.card.value}</div>
                <div className={"card-amount"}>You have {card.amount} of this card.</div>
                <div className={"card-mill-btn btn btn-m"} onClick={() => this.millCard(card.id)}>Mill card</div>
            </div>
        }
    }

    renderNotLoggedIn() {

        const cards = this.props.allCards;

        if (cards === null) {
            return "";
        }
        return this.renderCards(cards);
    }

    renderLoggedIn() {

        const user = this.props.user;
        const cards = user.cards;
        const allCards = this.props.allCards;

        let userCards;
        if (cards) {
            if (cards.length <= 0) {
                userCards =
                    <React.Fragment>
                        <h2>You do not have any cards. Please open or purchase a lootbox!</h2>
                        <Link
                            className={"btn btn-m"}
                            id={"home-btn"}
                            to={"/"}>
                            Go home
                        </Link>
                    </React.Fragment>
            } else {
                userCards =
                    <React.Fragment>
                        <h2>You have {cards.length} unique cards:</h2>
                        <div className={"cards-container"}>
                            {this.renderCards(cards)}
                        </div>
                    </React.Fragment>
            }
        }

        let notOwnedCards;
        if (allCards) {
            const missingCards = this.getMissing(cards, allCards);
            notOwnedCards =
                <React.Fragment>
                    <h2>You are missing {allCards.length - cards.length} unique cards:</h2>
                    {missingCards}
                </React.Fragment>
        }

        return (
            <React.Fragment>
                {userCards}
                {notOwnedCards}
            </React.Fragment>
        )
    }

    render() {

        const user = this.props.user;
        let content;
        if (!user) {
            content = this.renderNotLoggedIn();
        } else {
            content = this.renderLoggedIn();
        }

        return (
            <React.Fragment>
                {content}
                <Link
                    className={"btn btn-m"}
                    id={"home-btn"}
                    to={"/"}>
                    Go home
                </Link>
            </React.Fragment>
        )
    }
}

export default withRouter(Cards);