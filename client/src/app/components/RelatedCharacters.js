import React from "react";
import {Link} from "react-router-dom";
import {SingleCharacter} from "./SingleCharacter";
let configFile = require('../config');


export class RelatedCharacters extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            otherCharacter: []
        };
    }

    componentDidMount() {
        fetch("http://localhost:4000/api/GetHeroByUrl?name="+this.props.otherCharacter.trim(), {
            headers: {
                'Authorization': configFile.apiAuthorizationToken
            }
        })
            .then(results => results.json())
            .then(results => {
                this.setState({
                    otherCharacter: results.map ( otherCharacter => {

                        otherCharacter.imageUrl = "https://s3.ap-south-1.amazonaws.com/dc-wiki-project/characters/" + otherCharacter.imageUrl;

                        return (
                            <div className="related-character-item" key={otherCharacter.name}>
                                <Link to={`/character/${otherCharacter.url}` } onClick={ () => SingleCharacter.changeCharacterFunction() } >
                                    <img src={otherCharacter.imageUrl} alt={otherCharacter.name} />
                                    <p key={otherCharacter.name}>{otherCharacter.name}</p>
                                </Link>
                            </div>
                        )
                    })
                })
            }, error => {
                console.log(error);
            });
    }

    render() {
        return ( this.state.otherCharacter );
    }
}