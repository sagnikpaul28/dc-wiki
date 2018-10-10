import React from 'react';

export class SingleCharacter extends React.Component {
    constructor() {
        super();

        this.state = {
            character: []
        };
    }

    componentDidMount(){
        console.log(this.props.match.params.name);
        fetch("http://localhost:4000/api/SearchAHero?name="+this.props.match.params.name)
            .then(results => results.json())
            .then(results => {
                console.log(results);
                this.state = {
                    character: results.map( character => {
                        return (
                            <div className={character.name} />
                        )
                    })
                }
            }, error => {
                this.setState = error;
            })
    }

    render() {
        return(
            <div>
                <h1>Hero</h1>
                {this.state.character}
            </div>
        )
    }
}