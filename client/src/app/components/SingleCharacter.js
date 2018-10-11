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
        fetch("http://localhost:4000/api/GetHeroByUrl?name="+this.props.match.params.name)
            .then(results => results.json())
            .then(results => {
                this.setState({
                    character: results.map( character => {

                        character.wallpaper = '/img/wallpapers/' + character.imageUrl;
                        character.imageUrl = '/img/characters/' + character.imageUrl;
                        character.logoUrl = '/img/logo/' + character.logoUrl;

                        character.byLine = character.byLine ? <p className="byline">{character.byLine}</p> : null;

                        return (
                            <div className="single-character-div" key={character._id} >
                                <div className="character-banner">
                                    <img src={character.wallpaper } />
                                </div>
                                <div className="accent-break" style={ {borderColor: character.accentColor}} />

                                <div className="layer" />

                                <div className="image-container" >
                                    <img src={character.imageUrl} />
                                </div>
                                <div className="detail-container" >
                                    <h1>{character.name}</h1>
                                    {character.byLine}
                                    <h3>Real Name: {character.alias}</h3>
                                    <p className="first-apperance">First Appearance: {character.firstAppearance}</p>
                                    <p className="summary">{character.summary}</p>
                                </div>
                                <div className="other-container">
                                    <p>{character.description}</p>
                                </div>

                                {/*Powers, Related Characters*/}
                                
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