import React from "react";

export class StatusBar extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {

        if (!this.props.allCards || !this.props.user) {
            return "";
        }

        const user = this.props.user;
        const allCards = this.props.allCards;
        
        return <div className={"profile-container"}>
            <div className={"profile-info"}>User: {user.id}</div>
            <div className={"profile-info"}>Lootboxes: {user.lootboxes}</div>
            <div className={"profile-info"}>Cash: ${user.cash}</div>
            <div className={"profile-info"}>Unique cards: {user.cards.length} / {allCards.length}</div>
            <div className={"profile-info"}>Total cards: {user.cardAmount}</div>
        </div>
    }
}