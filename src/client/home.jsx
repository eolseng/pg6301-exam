import React from "react";
import {Link} from 'react-router-dom';

export class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h2>Welcome to the app!</h2>
            </div>
        );
    }
}