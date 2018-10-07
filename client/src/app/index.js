import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from "react-router";
import createBrowserHistory from "history/createBrowserHistory";

import { Home } from './components/Home';
import { Edit } from './components/Edit';

const newHistory = createBrowserHistory();

class App extends React.Component {
    render() {
        return (
            <Router history={newHistory} >
                <div>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/edit" component={Edit} />
                </div>
            </Router>
        )
    }
}

render(<App/>, window.document.getElementById("app"));