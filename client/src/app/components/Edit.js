import React from "react";

export class Edit extends React.Component {

    constructor() {
        super();

        this.state = {
            characters: []
        }
    }

    componentDidMount() {
        fetch("http://localhost:4000/api/GetAllHeroes?key=name&sort=asc")
            .then(results => results.json())
            .then(results => {
                this.setState({
                    characters: results.map( item => {
                        return(
                            <div key={item.name} className="character-item">
                                <div className="character-left">
                                    <span>{item.name}</span> - <span>{item.alias}</span>
                                </div>
                                <div className="character-right">
                                    <button className="edit-button">Edit</button>
                                    <button className="delete-button">Delete</button>
                                </div>
                            </div>
                        );
                    })
                })
            })
    }

    render() {
        return (
            <div className="edit">
                <h1>List Of All Characters
                    <button className="add-new" onClick={() => console.log('A')}>+</button>
                </h1>
                <br/>
                {this.state.characters}
            </div>
        );
    }
}