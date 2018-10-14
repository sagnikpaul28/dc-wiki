import React from "react";

export class AddCharacter extends React.Component {
    render() {
        return(
            <div className="add-character-container">
                <div className="form">
                    <label>Name:</label>
                    <input type="text" name="name" className="form-input" />
                    <label>Real Name:</label>
                    <input type="text" name="actual-name" className="form-input" />
                    <label>First Appearance:</label>
                    <input type="text" name="first-appearance" className="form-input" />
                    <label>Superpowers (separated by comma):</label>
                    <input type="text" name="superpowers" className="form-input" />
                    <label>Summary:</label>
                    <input type="text" name="summary" className="form-input" />
                    <label>Description:</label>
                    <input type="text" name="description" className="form-input" />
                    <label>Byline:</label>
                    <input type="text" name="byLine" className="form-input" />
                    <label>Related Characters (separated by comma):</label>
                    <input type="text" name="related-characters" className="form-input" />
                    <button type="button">Submit</button>
                </div>
            </div>
        );
    }
}

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