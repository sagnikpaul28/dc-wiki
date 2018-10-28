import React from 'react';

export class ModifyCharacter extends React.Component{
    constructor() {
        super();

        this.state = {
            items: [],
            item: ''
        }
    }

    callEditCharacterComponent( item ) {
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

                        item.imageUrl = "/img/characters/" + item.imageUrl;
                        item.logoUrl = "/img/logo/" + item.logoUrl;

                        return(
                            <div className="items" key={item.name} onClick={() => this.callEditCharacterComponent( item )} >
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
        this.setState({
            item: ''
        });
        this.fetchCharacters();
        document.querySelector('body').style.overflow = 'initial';
    }

    render() {
        let editComponent = '';
        if (this.state.item !== '') {
            editComponent = <EditCharacter item={this.state.item} onSaveFunction={this.onEditComponentSave.bind(this)}/>;
        }else {
            editComponent = '';
        }

        return(
            <div className="modify-character-div">
                {this.state.items}
                {editComponent}
            </div>
        );
    }
}

export class EditCharacter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            url: this.props.item.url,
            name: this.props.item.name,
            alias: this.props.item.alias,
            firstAppearance: this.props.item.firstAppearance,
            relatedCharacters: this.props.item.relatedCharacters,
            accentColor: this.props.item.accentColor,
            summary: this.props.item.summary,
            description: this.props.item.description,
            byLine: this.props.item.byLine,
            powers: this.props.item.powers,
            characterImage: this.props.item.imageUrl,
            logoImage: this.props.item.logoUrl,
            message: ''
        };
    }

    onSave() {
        let obj = {};
        if (this.state.name !== this.props.item.name) {
            obj['name'] = this.state.name;
        }
        if (this.state.alias !== this.props.item.alias) {
            obj['alias'] = this.state.alias;
        }
        if (this.state.accentColor !== this.props.item.accentColor) {
            obj['accentColor'] = this.state.accentColor;
        }
        if (this.state.summary !== this.props.item.summary) {
            obj['summary'] = this.state.summary;
        }
        if (this.state.description !== this.props.item.description) {
            obj['description'] = this.state.description;
        }
        if (this.state.byLine !== this.props.item.byLine) {
            obj['byLine'] = this.state.byLine;
        }
        if (this.state.powers !== this.props.item.powers) {
            obj['powers'] = this.state.powers;
        }
        if (this.state.firstAppearance !== this.props.item.firstAppearance) {
            obj['firstAppearance'] = this.state.firstAppearance;
        }
        if (this.state.relatedCharacters !== this.props.item.relatedCharacters) {
            obj['relatedCharacters'] = this.state.relatedCharacters;
        }
        obj['url'] = this.props.item.url;

        if (Object.keys(obj).length === 1) {
            this.setState({
                message: 'Nothing to Save'
            });

            document.querySelector('.modal p').classList = '';
            document.querySelector('.modal .modal-content').classList += ' show-paragraph';
        }else {
            obj = JSON.stringify(obj);
            this.setState({
                message: 'Saving...'
            });

            document.querySelector('.modal p').classList = '';
            document.querySelector('.modal .modal-content').classList += ' show-paragraph';

            fetch('http://localhost:4000/api/UpdateAHero', {
                method: 'POST',
                body: obj,
                headers: {
                    'Content-Type':'application/json'
                }
            }).then(res => res.json())
                .then(res => {
                    console.log(res);
                    this.setState({
                        message: 'Saved'
                    });
                })
        }

    }

    onCloseModal() {
        this.props.onSaveFunction();
    }

    onChangeInput(event) {
        this.setState({
            [event.target.name] : event.target.value
        });
    }

    render() {
        return (
            <div className="modal">
                <div className="modal-container">
                    <div className="modal-content">
                        <div className="input-container">
                            <input type="text" name="name" className="form-input filled" onChange={this.onChangeInput.bind(this)} value={this.state.name} />
                            <label>Name:</label>
                        </div>
                        <div className="input-container">
                            <input type="text" name="alias" className="form-input filled" onChange={this.onChangeInput.bind(this)} value={this.state.alias} />
                            <label>Real Name:</label>
                        </div>
                        <div className="input-container">
                            <input type="text" name="firstAppearance" className="form-input filled" onChange={this.onChangeInput.bind(this)} value={this.state.firstAppearance} />
                            <label>First Appearance:</label>
                        </div>
                        <div className="input-container">
                            <input type="text" name="superpowers" className="form-input filled" onChange={this.onChangeInput.bind(this)} value={this.state.powers} />
                            <label>Superpowers (separated by comma):</label>
                        </div>
                        <div className="input-container">
                            <input type="text" name="summary" className="form-input filled" onChange={this.onChangeInput.bind(this)} value={this.state.summary} />
                            <label>Summary:</label>
                        </div>
                        <div className="input-container">
                            <input type="text" name="description" className="form-input filled" onChange={this.onChangeInput.bind(this)} value={this.state.description} />
                            <label>Description:</label>
                        </div>
                        <div className="input-container">
                            <input type="text" name="byLine" className="form-input filled" onChange={this.onChangeInput.bind(this)} value={this.state.byLine} />
                            <label>Byline:</label>
                        </div>
                        <div className="input-container">
                            <input type="text" name="relatedCharacters" className="form-input filled" onChange={this.onChangeInput.bind(this)} value={this.state.relatedCharacters} />
                            <label>Related Characters (separated by comma):</label>
                        </div>
                        <div className="input-container">
                            <label>Character Image:</label>
                            <img src={this.state.characterImage} className="characterImage" />
                            <input type="file" name="imageUrl" className="form-input" ref={(ref) => { this.uploadImage = ref; }} />
                        </div>
                        <div className="input-container">
                            <label>Logo Image:</label>
                            <img src={this.state.logoImage} className="logoImage"/>
                            <input type="file" name="logoUrl" className="form-input" ref={(ref) => { this.uploadLogo = ref; }}/>
                        </div>
                        <div className="input-container">
                            <input type="text" name="accentColor" className="form-input filled" onChange={this.onChangeInput.bind(this)} value={this.state.accentColor} />
                            <label>Accent Color (in hex): <span style={ {backgroundColor: this.state.accentColor} }/></label>
                        </div>
                        <div className="input-container">
                            <input type="text" name="url" className="form-input filled" onChange={this.onChangeInput.bind(this)} value={this.state.url} />
                            <label>Url:</label>
                        </div>
                    </div>
                    <p className="hide">{this.state.message}</p>
                    <button className="submit" type="submit" onClick={this.onSave.bind(this)}>Save</button>
                    <button className="close" type="button" onClick={this.onCloseModal.bind(this)}>Close</button>
                </div>
            </div>
        )
    }
}