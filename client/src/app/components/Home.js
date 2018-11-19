import React from 'react';
import { Link } from 'react-router-dom';
let configFile = require('../config');

export class Home extends React.Component {
    constructor() {
        super();

        this.state = {
            items: [],
            search: ''
        };
    }

    fetchAllCharacters(query) {
        let fetchUrl = "http://localhost:4000/api/SearchAHero";
        if (query) {
            fetchUrl = fetchUrl + "?name=" + query;
        }
        fetch(fetchUrl, {
            headers: {
                'Authorization': configFile.apiAuthorizationToken
            }
        })
            .then(results => results.json())
            .then(
                (result) => {
                    if (result.length === 0) {
                        this.setState({
                            items: <NoItemsFound />
                        })
                    }else {
                        this.setState({
                            items: result.map( (item) => {
                                //Set Accent Color
                                let divStyles = {
                                    backgroundColor: item.accentColor
                                };

                                //Fetch directory of images
                                item.imageUrl = "https://s3.ap-south-1.amazonaws.com/dc-wiki-project/characters/" + item.imageUrl;

                                return (
                                    <div className="item" key={item._id}>
                                        <Link to={`/character/${item.url}`} >
                                            <div className="color-layer" style={ divStyles } />
                                            <div className="image-layer">
                                                <img src={item.imageUrl}/>
                                            </div>
                                            <div className="content-layer">
                                                <h2 className="alias">{item.alias}</h2>
                                                <h1 className="name">{item.name}</h1>
                                                <hr />
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })
                        })
                    }
                },
                (error) => {
                    this.setState({
                        items: error
                    })
                }
            )
    }

    componentDidMount() {
        this.fetchAllCharacters(null);
    }

    searchHero(parameter) {
        this.fetchAllCharacters(parameter);
    }

    render() {
        return (
            <div className="index">
                <img src="/img/logo.png" className="logo"/>
                <SearchCharacterInput searchHero={this.searchHero.bind(this)}/>
                {this.state.items}
            </div>
        );
    }
}

export class SearchCharacterInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query: '',
            isOpen: 0
        }
    }

    onInputChange(event) {
        this.setState({
            query: event.target.value
        });
    }

    componentDidMount() {
        let $this = this;

        if (window.innerWidth <= 768) {
            this.setState({
                isOpen: 1
            });
            document.querySelectorAll('input[name=search]')[0].classList = '';
        }

        document.addEventListener('click', function(event) {
            if (!event.target.closest('.search-div') && window.innerWidth > 768 ) {
                document.querySelectorAll('input[name=search]')[0].classList = 'hide';
                $this.setState({
                    isOpen: 0
                });
            }
        })
    }

    callSearchHeroApiParent() {
        if (this.state.isOpen === 1) {
            this.props.searchHero(this.state.query);
        } else {
            this.setState({
                isOpen: 1
            });
            document.querySelectorAll('input[name=search]')[0].classList = '';
        }
    }

    render() {
        return (
            <div className="search-div">
                <input name="search" type="text" placeholder="search.." value={this.state.query} onChange={this.onInputChange.bind(this)} className="hide"/>
                <img src="/img/search.png" className="icon" alt="search icon" onClick={this.callSearchHeroApiParent.bind(this)}/>
            </div>
        )
    }
}

class NoItemsFound extends React.Component {
    render() {
        return (
            <p className="not-found">Sorry. No Characters Found.</p>
        )
    }
}