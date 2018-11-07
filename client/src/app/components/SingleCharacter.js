import React from 'react';
import { RelatedCharacters } from "./RelatedCharacters";
let configFile = require('../config');


export class SingleCharacter extends React.Component {
    constructor() {
        super();

        this.state = {
            character: []
        };
    }

    static changeCharacterFunction() {
        SingleCharacter.forceUpdate();
    }

    //changing the page title
    changePageTitle(title, alias) {
        let pageTitle = title;
        if (alias) {
            pageTitle += ' | ' + alias;
        }
        document.title = pageTitle;
    }

    fetchCharacterDetails() {
        fetch("http://localhost:4000/api/GetHeroByUrl?name="+this.props.match.params.name, {
            headers: {
                'Authorization': configFile.apiAuthorizationToken
            }
        })
            .then(results => results.json())
            .then(results => {

                this.changePageTitle(results[0].name, results[0].alias);

                this.setState({
                    character: results.map( character => {

                        character.wallpaper = '/img/wallpapers/' + character.wallpaperUrl;
                        character.imageUrl = '/img/characters/' + character.imageUrl;

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
                                    <p className="powers">Powers: <span>{character.powers}</span></p>
                                    <div className="related-characters">
                                        <p>Related Characters: </p>
                                        {character.relatedCharacters.split(",").map( item => {
                                            return <RelatedCharacters otherCharacter={item} key={item} changeCharacterFunction={SingleCharacter.changeCharacterFunction.bind(this) }/>
                                        })}
                                    </div>
                                </div>
                            </div>
                        )
                    }),
                    characterName: this.props.match.params.name
                });
            }, error => {
                console.log(error);
            })
    }

    componentDidMount() {
        this.fetchCharacterDetails();
    }

    render() {
        return(
            <div className="main-container">
                <a href="/" >
                    <img src="/img/logo.png" className="single-page-logo"/>
                </a>
                {this.state.character}
            </div>
        )
    }
}