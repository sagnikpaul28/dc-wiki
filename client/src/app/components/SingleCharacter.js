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
                this.setState({
                    character: results.map( character => {

                        character.imageUrl = '/img/characters/' + character.imageUrl;
                        character.logoUrl = '/img/logo/' + character.logoUrl;

                        character.byLine = character.byLine ? <p>{character.byLine}</p> : null;
                        console.log(character.byLine);

                        return (
                            <div className="single-character-div" key={character._id}>
                                <div className="image-container">
                                    <img src={character.imageUrl} />
                                </div>
                                <div className="text-container">
                                    <img src={character.logoUrl} />
                                    <h1>{character.name}</h1>
                                    {character.byLine}
                                    <h3>{character.alias}</h3>
                                    <p>{character.summary}</p>
                                </div>
                                <div className="extra-container">
                                    <p>{character.description}</p>
                                    <ol>Powers: {character.powers.split(",").map(power => <li>{power}</li>)}</ol>
                                    <p>{character.firstAppearance}</p>
                                    <p>Related Characters: {character.relatedCharacters}</p>
                                </div>
                            </div>
                        )
                    })
                })
            }, error => {
                this.setState = error;
            })
    }

    render() {
        console.log(this.state.character);
        return(
            <div>
                {this.state.character}
            </div>
        )
    }
}