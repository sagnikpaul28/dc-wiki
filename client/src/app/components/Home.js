import React from 'react';

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
                        items: result.map( (item) => {
                            let divStyles = {
                                backgroundColor: item.accentColor
                            };

                            item.imageUrl = "/img/characters/" + item.imageUrl;

                            return (
                              <div className="item" style={ divStyles } key={item._id}>
                                  <div className="layer">
                                      <img src={item.imageUrl}/>
                                  </div>
                                  <img src={item.logoUrl} className="item-logo"/>
                                  <h1 className="item-name">{item.name}</h1>
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
        console.log(this.state.items);
        return (
            <div className="items">
                {this.state.items}
            </div>
        );
    }
}