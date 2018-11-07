import React from "react";
let configFile = require('../config');

export class EditCharacterModal extends React.Component {
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
            wallpaperImage: this.props.item.wallpaperUrl,
            message: '',
            version: 0
        };
    }

    componentDidMount() {
        //Store this in variable thisObject
        let thisObject = this;
        document.addEventListener('click', function(event){
            if (event.target.className === 'modal') {
                thisObject.props.onCloseFunction();
            }
        });
    }

    //save changes
    onSave() {
        let obj = {};

        //Only send the data which are modified
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
        if (this.state.url !== this.props.item.url) {
            obj['url'] = this.state.url;
        }
        obj['actualUrl'] = this.props.item.url;

        let characterImage = this.uploadImage.files[0];
        let wallpaperImage = this.uploadWallpaper.files[0];

        //Check if any item is modified
        if (Object.keys(obj).length === 1 && !(characterImage || wallpaperImage)) {
            this.setState({
                message: 'Nothing to Save'
            });

            document.querySelector('.modal p').classList = '';
            document.querySelector('.modal .modal-content').classList += ' show-paragraph';
        }else {

            //Check if images are uploaded
            if (characterImage || wallpaperImage) {

                const data = new FormData();
                data.append('fileName', this.props.item.url);

                if (characterImage) {
                    data.append('fileImage', characterImage);
                }

                if (wallpaperImage) {
                    data.append('wallpaperImage', wallpaperImage);
                }

                this.setState({
                    message: 'Uploading'
                });

                fetch("http://localhost:4000/api/UploadImage", {
                    method: "POST",
                    body: data,
                    headers: {
                        'Authorization': configFile.apiAuthorizationToken
                    }
                }).then(res => {
                    if (res.status === 200) {
                        this.setState({
                            version: this.state.version++,
                            message: 'Uploaded',
                            characterImage: this.state.characterImage + "?v=" + this.state.version,
                            wallpaperImage: this.state.wallpaperImage + "?v=" + this.state.version
                        });
                    }
                })
            }

            obj = JSON.stringify(obj);
            this.setState({
                message: 'Saving...'
            });

            document.querySelector('.modal p').classList = '';
            document.querySelector('.modal .modal-content').classList += ' show-paragraph';

            //Update the details
            fetch('http://localhost:4000/api/UpdateAHero', {
                method: 'POST',
                body: obj,
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': configFile.apiAuthorizationToken
                }
            }).then(res => res.json())
                .then(() => {
                    this.setState({
                        message: 'Saved.'
                    });
                    this.props.onSaveFunction();
                })
        }

    }

    onDelete() {
        fetch(`http://localhost:4000/api/DeleteByUrl?url=${this.props.item.url}`, {
            method: 'DELETE',
            body: JSON.stringify({
                characterImage: this.state.characterImage,
                wallpaperImage: this.state.wallpaperImage
            }),
            headers: {
                'Content-Type':'application/json',
                'Authorization': configFile.apiAuthorizationToken
            }
        }).then(res => res.json())
            .then(() => {
                window.location.reload();
            });
    }

    //call onCloseFunction of parent component
    onCloseModal() {
        this.props.onCloseFunction();
    }

    //Save inputs in state variable on change
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
                            <label>Wallpaper Image:</label>
                            <img src={this.state.wallpaperImage} className="wallpaperImage" />
                            <input type="file" name="wallpaperUrl" className="form-input" ref={(ref) => { this.uploadWallpaper = ref; }} />
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
                    <button className="delete" type="button" onClick={this.onDelete.bind(this)}>Delete</button>
                    <button className="close" type="button" onClick={this.onCloseModal.bind(this)}>Close</button>
                </div>
            </div>
        )
    }
}