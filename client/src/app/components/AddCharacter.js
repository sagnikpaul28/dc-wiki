import React from "react";

export class AddCharacter extends React.Component {
    constructor() {
        super();

        this.state = {
            name: "",
            alias: "",
            accentColor: "",
            firstAppearance: "",
            superpowers: "",
            summary: "",
            description: "",
            byLine: "",
            relatedCharacters: "",
            url: "",
            message: ""
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

        //Check if any filed is empty
        if (this.state.name.trim() === '' || this.state.alias.trim() === '' || this.state.firstAppearance.trim() === '' || this.state.superpowers.trim() === '' || this.state.accentColor.trim() === '' || this.state.summary.trim() === '' || this.state.description.trim() === '' || this.state.byLine.trim() === '' || this.state.relatedCharacters.trim() === '' || this.state.url.trim() === '') {
            this.setState({
                message: 'Please fill out all the fields'
            });
            return;
        }

        //Check if Accent Color is proper
        if ( this.state.accentColor.charAt(0) !== '#' || !(this.state.accentColor.length === 4 || this.state.accentColor.length === 7) ) {
            this.setState({
                message: 'Please enter proper Accent Color'
            });
            return;
        }
        let accentColorCopy = this.state.accentColor.substring(1).split('');
        console.log(accentColorCopy);
        for (let i=0; i< accentColorCopy.length; i++) {
            console.log(accentColorCopy[i]);
            if ( !((accentColorCopy[i] >= '0' && accentColorCopy[i] <= '9') || (accentColorCopy[i] >= 'a' && accentColorCopy[i] <= 'f') || (accentColorCopy[i] >= 'A' && accentColorCopy[i] <= 'F'))){
                this.setState({
                    message: 'Please enter proper Accent Color'
                });
                return;
            }
        }

        //Make the message part blank
        this.setState({
            message: ''
        });

        //Save the file to FormData object
        let fileImage = this.uploadLogo.files[0];
        let logoImage = this.uploadLogo.files[0];

        const data = new FormData();

        data.append('fileImage', fileImage);
        data.append('logoImage', logoImage);
        data.append('fileName', this.state.url);

        fetch("http://localhost:4000/api/UploadImage", {
            method: "POST",
            body: data,
        }).then(res => {
            if (res.status === 200) {
                this.setState({
                    message: 'Uploading'
                });
                let data = {
                    name: this.state.name,
                    alias: this.state.alias,
                    accentColor: this.state.accentColor,
                    firstAppearance: this.state.firstAppearance,
                    superpowers: this.state.superpowers,
                    summary: this.state.summary,
                    description: this.state.description,
                    byLine: this.state.byLine,
                    relatedCharacters: this.state.relatedCharacters,
                    url: this.state.url,
                    imageUrl: this.state.url + fileImage.name.substring( fileImage.name.lastIndexOf('.'), fileImage.name.length ),
                    logoUrl: this.state.url + logoImage.name.substring( logoImage.name.lastIndexOf('.'), logoImage.name.length )
                };
                data = JSON.stringify(data);
                console.log(data);

                fetch("http://localhost:4000/api/AddNewHero", {
                    method: "POST",
                    body: data,
                    headers: {
                        'Content-Type':'application/json',
                    }
                }).then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        //Clear form fields
                        this.setState({
                            name: "",
                            alias: "",
                            accentColor: "",
                            firstAppearance: "",
                            superpowers: "",
                            summary: "",
                            description: "",
                            byLine: "",
                            relatedCharacters: "",
                            url: "",
                            message: "Uploaded successfully"
                        });
                        //Clear selected files
                        this.uploadLogo.value = null;
                        this.uploadImage.value = null;

                    }else {
                        this.setState({
                            message: 'Something went wrong. Try again.'
                        })
                    }
                })
            }else if (res.status === 304) {
                this.setState({
                    message: 'Character already exists'
                });
            }
        });
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
                        <input type="text" name="accentColor" className="form-input" onChange={this.onChangeInput.bind(this)} value={this.state.accentColor} />
                        <label>Accent Color (in hex):</label>
                    </div>
                    <div className="input-container">
                        <input type="text" name="url" className="form-input" onChange={this.onChangeInput.bind(this)} value={this.state.url} />
                        <label>Url:</label>
                    </div>
                    <p>{this.state.message}</p>
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    }
}