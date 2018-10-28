import React from 'react';
import { EditCharacterModal } from './EditCharacterModal';

export class ModifyCharacter extends React.Component{
    constructor() {
        super();

        this.state = {
            items: [],
            item: ''
        }
    }

    callEditCharacterModalComponent( item ) {
        this.setState({
            item: item
        });
        document.querySelector('body').style.overflow = 'hidden';
    }

    componentDidMount() {
        this.fetchCharacters();
    }

    fetchCharacters() {
        fetch('http://localhost:4000/api/GetAllHeroes')
            .then(result => result.json())
            .then(result => {
                this.setState({
                    items: result.map((item) => {

                        item.wallpaperUrl = "/img/wallpapers/" + item.wallpaperUrl;
                        item.imageUrl = "/img/characters/" + item.imageUrl;
                        item.logoUrl = "/img/logo/" + item.logoUrl;

                        return(
                            <div className="items" key={item.name} onClick={() => this.callEditCharacterModalComponent( item )} >
                                <div className="image">
                                    <img src={item.imageUrl} />
                                </div>
                                <p>{item.name}</p>
                                <p>{item.alias}</p>
                                <hr />
                            </div>
                        )
                    })
                })
            })
    }

    onEditComponentSave() {
        this.fetchCharacters();
        this.forceUpdate();
    }

    onEditComponentClose() {
        this.setState({
            item: ''
        });
        this.fetchCharacters();
        document.querySelector('body').style.overflow = 'initial';
    }

    render() {
        let editModal = '';
        if (this.state.item !== '') {
            editModal = <EditCharacterModal item={this.state.item} onCloseFunction={this.onEditComponentClose.bind(this)} onSaveFunction={this.onEditComponentSave.bind(this)}/>;
        }else {
            editModal = '';
        }

        return(
            <div className="modify-character-div">
                {this.state.items}
                {editModal}
            </div>
        );
    }
}