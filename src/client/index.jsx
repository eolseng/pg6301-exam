import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import {Home} from "./home";

const App = () => {
    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route exact path={"/"} component={Home}/>
                    <Route component={NotFound}/>
                </Switch>
            </div>
        </BrowserRouter>
    );
};

const NotFound = () => {
    return (
        <div>
            <h2>NOT FOUND: 404</h2>
            <p>ERROR: The document you requested is not available.</p>
        </div>
    );
};

ReactDOM.render(<App/>, document.getElementById("root"));