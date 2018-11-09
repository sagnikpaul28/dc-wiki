import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home } from './components/Home';
import { SingleCharacter } from './components/SingleCharacter';
import { Edit } from './components/Edit';
import { AddCharacter } from "./components/AddCharacter";
import { Error} from './components/404';

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/character/:name" component={SingleCharacter} />
                    <Route exact path="/edit/add" component={AddCharacter} />
                    <Route exact path="/edit" component={Edit} />
                    <Route component={Error} />
                </Switch>
            </BrowserRouter>
        )
    }
}

render(<App/>, window.document.getElementsByClassName("app")[0]);