import React from "react";

export class AddCharacter extends React.Component {
    constructor() {
        super();

        this.state = {
            name: "",
            alias: "",
            firstAppearance: "",
            superpowers: "",
            summary: "",
            description: "",
            byLine: "",
            relatedCharacters: "",
            imageUrl: "",
            logoUrl: "",
            url: ""
        };
    }
    onChangeInput(event) {
        let property = event.target;
        let propertyName = event.target.name;
        let propertyValue = event.target.value;
        this.setState({ [propertyName] : propertyValue },
            () => {
                //If value is there, add class 'filled'. If value is not there, remove class 'filled
                if (this.state[propertyName].trim() !== "" && property.className.indexOf('filled') === -1) {
                    property.className += " filled";
                }else if (this.state[propertyName].trim() === "" && property.className.indexOf('filled') !== -1) {
                    property.className = property.className.substring(0, property.className.indexOf('filled')) ;
                }
            });
    }

    static onFileUpload(event) {
        let propertyName = event.target.name;
        let propertyValue = event.target.value;
        this.setState({ [propertyName] : propertyValue });
    }

    onFormSubmit(event){
        event.preventDefault();

        const data = new FormData();

        /*
        Need to check if url already exists in backend
         */

        data.append('fileImage', this.uploadImage.files[0]);
        data.append('logoImage', this.uploadLogo.files[0]);
        data.append('fileName', this.state.url);

        fetch("http://localhost:4000/api/UploadImage", {
            method: "POST",
            body: data,
        }).then(res => {
            console.log(res);
        });

        console.log(this.state);
    }

    render() {
        return(
            <div className="add-character-container">
                <form className="form" onSubmit={ this.onFormSubmit.bind(this) }>
                    <div className="input-container">
                        <input type="text" name="name" className="form-input" onChange={this.onChangeInput.bind(this)} value={this.state.name} />
                        <label>Name:</label>
                    </div>
                    <div className="input-container">
                        <input type="text" name="alias" className="form-input" onChange={this.onChangeInput.bind(this)} value={this.state.alias} />
                        <label>Real Name:</label>
                    </div>
                    <div className="input-container">
                        <input type="text" name="firstAppearance" className="form-input" onChange={this.onChangeInput.bind(this)} value={this.state.firstAppearance} />
                        <label>First Appearance:</label>
                    </div>
                    <div className="input-container">
                        <input type="text" name="superpowers" className="form-input" onChange={this.onChangeInput.bind(this)} value={this.state.superpowers} />
                        <label>Superpowers (separated by comma):</label>
                    </div>
                    <div className="input-container">
                        <input type="text" name="summary" className="form-input" onChange={this.onChangeInput.bind(this)} value={this.state.summary} />
                        <label>Summary:</label>
                    </div>
                    <div className="input-container">
                        <input type="text" name="description" className="form-input" onChange={this.onChangeInput.bind(this)} value={this.state.description} />
                        <label>Description:</label>
                    </div>
                    <div className="input-container">
                        <input type="text" name="byLine" className="form-input" onChange={this.onChangeInput.bind(this)} value={this.state.byLine} />
                        <label>Byline:</label>
                    </div>
                    <div className="input-container">
                        <input type="text" name="relatedCharacters" className="form-input" onChange={this.onChangeInput.bind(this)} value={this.state.relatedCharacters} />
                        <label>Related Characters (separated by comma):</label>
                    </div>
                    <div className="input-container">
                        <label>Character Image:</label>
                        <input type="file" name="imageUrl" className="form-input" ref={(ref) => { this.uploadImage = ref; }} />
                    </div>
                    <div className="input-container">
                        <label>Logo Image:</label>
                        <input type="file" name="logoUrl" className="form-input" ref={(ref) => { this.uploadLogo = ref; }}/>
                    </div>
                    <div className="input-container">
                        <input type="text" name="url" className="form-input" onChange={this.onChangeInput.bind(this)} value={this.state.url} />
                        <label>Url:</label>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

export class Edit extends React.Component {

    constructor() {
        super();

        this.state = {
            characters: []
        }
    }

    componentDidMount() {
        fetch("http://localhost:4000/api/GetAllHeroes?key=name&sort=asc")
            .then(results => results.json())
            .then(results => {
                this.setState({
                    characters: results.map( item => {
                        return(
                            <div key={item.name} className="character-item">
                                <div className="character-left">
                                    <span>{item.name}</span> - <span>{item.alias}</span>
                                </div>
                                <div className="character-right">
                                    <button className="edit-button">Edit</button>
                                    <button className="delete-button">Delete</button>
                                </div>
                            </div>
                        );
                    })
                })
            })
    }

    render() {
        return (
            <div className="edit">
                <h1>List Of All Characters
                    <button className="add-new" onClick={() => console.log('A')}>+</button>
                </h1>
                <br/>
                {this.state.characters}
            </div>
        );
    }
}