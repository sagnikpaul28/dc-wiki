import React from "react";

export class Edit extends React.Component {
    constructor() {
        super();

        this.state = {
            items: []
        };
    }

    componentDidMount() {
        fetch("http://localhost:4000/api/GetAllHeroes")
            .then(results => results.json())
            .then(results => {
                this.setState({
                    items: results.map( item => {

                        item.imageUrl = '/img/characters/' + item.imageUrl;
                        item.logoUrl = '/img/logo/' + item.logoUrl;
                        item.powers = item.powers.split(",");
                        item.powers = item.powers.map(power => <li key={power}>{power}</li> );

                        return(
                            <div className="edit-item" key={item._id}>
                                <img src={item.imageUrl} alt={item.name} />
                                <div className="content">
                                    <img src={item.logoUrl} alt={item.name + "logo"} />
                                    <h2><b>{item.name}</b></h2>
                                    <p><b>Alias:</b> {item.alias}</p>
                                    <p><b>By Line</b> {item.byLine}</p>
                                    <p><b>Summary:</b> {item.summary}</p>
                                    <p><b>Description:</b> {item.description}</p>
                                    <p><b>Accent Color:</b> {item.accentColor}</p>
                                    <p><b>Powers: </b></p><ol>{item.powers}</ol>
                                    <p><b>First Appearance:</b> {item.firstAppearance}</p>
                                </div>
                                <hr/>
                            </div>
                        );

                    })
                })
            }, error => {
                this.setState = error;
            })
    }

    render() {
        console.log(this.state.items);
        return (
            <div className="edit-items">
                {this.state.items}
            </div>
        );
    }
}