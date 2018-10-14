import React from 'react';
import { Link } from 'react-router-dom';

export class Home extends React.Component {
    constructor() {
        super();

        this.state = {
            items: []
        };
    }

    componentDidMount() {
        fetch("http://localhost:4000/api/GetAllHeroes")
            .then(results => results.json())
            .then(
                (result) => {
                    this.setState({
                        items: result.map( (item ) => {
                            //Set Accent Color
                            let divStyles = {
                                backgroundColor: item.accentColor
                            };

                            //Fetch directory of images
                            item.imageUrl = "/img/characters/" + item.imageUrl;
                            item.logoUrl = "/img/logo/" + item.logoUrl;

                            return (
                              <div className="item" key={item._id}>
                                  <Link to={`/character/${item.url}`} >
                                      <div className="color-layer" style={ divStyles } />
                                      <div className="image-layer">
                                          <img src={item.imageUrl}/>
                                      </div>
                                      <div className="content-layer">
                                          <img src={item.logoUrl} className="logo"/>
                                          <h1 className="name">{item.name}</h1>
                                      </div>
                                  </Link>
                              </div>
                            );
                        })
                    })
                },
                (error) => {
                    this.setState({
                        items: error
                    })
                }
            )
    }

    render() {
        return (
            <div className="items">
                {this.state.items}
            </div>
        );
    }
}