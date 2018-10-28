const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');

//Import Schema
const Heroes = require("./model");

//Setup Router and Express Instance
const router = express.Router();
const app = express();

app.use(cors());
app.use(fileUpload());


//Setup Mongoose
mongoose.connect("mongodb://localhost/dc");
mongoose.Promise = global.Promise;


//Setup BodyParser
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//Get Name in Ascending or Descending Order
function compareAsc (a, b) {
    if (a.name > b.name) {
        return 1;
    }else if (a.name < b.name) {
        return -1;
    }
    return 0;
}
function compareDesc (a, b) {
    if (a.name > b.name) {
        return -1;
    }else if (a.name < b.name) {
        return 1;
    }
    return 0;
}

/*
Get All Heroes
Key = Name, Sort = ASC for ascending order of name
Key = Name, Sort = DESC for descending order of name
*/
router.get("/api/GetAllHeroes", function(req, res, next) {
    Heroes.find({})
        .then(function(result){
            if (req.query.key){
                if (req.query.key.toLowerCase() === 'name'){
                    if (req.query.sort.toLowerCase() === 'asc') {
                        result.sort(compareAsc);
                    }else if (req.query.sort.toLowerCase() === 'desc'){
                        result.sort(compareDesc);
                    }
                }
            }
            res.send(result);
        }).catch(next);
});

//Add A Hero
router.post("/api/AddNewHero", function(req, res, next) {
    Heroes.create(req.body)
        .then(function(result){
            res.send(result);
        }).catch(next);
});

//Update A Hero by its url
router.post("/api/UpdateAHero", function(req, res, next) {
    let url = req.body.url;
    Heroes.findOneAndUpdate({url: url}, req.body)
        .then(function(result){
            res.send(result);
        }).catch(next);
});

//Search for Heroes
router.get("/api/SearchAHero", function(req, res, next) {
    Heroes.find({})
        .then(function(result){
            result = result.filter(obj => {
                return obj.name.toLowerCase().indexOf(req.query.name.toLowerCase()) != -1 || ( obj.alias != null ? (obj.alias.toLowerCase().indexOf(req.query.name.toLowerCase()) != -1) : false )
            });
            res.send(result);
        }).catch(next);
});

//Get Hero By Url
router.get("/api/GetHeroByUrl", function(req, res, next) {
    Heroes.find({})
        .then( function(result)  {
            result = result.filter(obj => {
                return obj.url === req.query.name.toLowerCase();
            });
            res.send(result);
        }).catch(next);
});

//Delete a hero by url
router.delete("/api/DeleteByUrl", function(req, res, next) {
    fs.unlink(`/Users/sagnikpaul28/Documents/dc-wiki/client/src${req.body.characterImage}`);
    fs.unlink(`/Users/sagnikpaul28/Documents/dc-wiki/client/src${req.body.logoImage}`);
    fs.unlink(`/Users/sagnikpaul28/Documents/dc-wiki/client/src${req.body.wallpaperImage}`);
    Heroes.findOneAndDelete({url: req.query.url})
        .then(function(result){
            res.send(result);
        }).catch(next);
});

//Upload Images
router.post("/api/UploadImage", function(req, res, next) {
    let imageFile = req.files.fileImage;
    let logoFile = req.files.logoImage;
    let wallpaperFile = req.files.wallpaperImage;
    let fileName = req.body.fileName;

    let fileExtension = imageFile.name.substring(imageFile.name.lastIndexOf('.') + 1, imageFile.name.length);

    //insert images in file
    if (imageFile) {

        imageFile.mv(`/Users/sagnikpaul28/Documents/dc-wiki/client/src/img/characters/${fileName}.${fileExtension}`, function(err) {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
        });
    }

    //insert logo in file
    if (logoFile){

        logoFile.mv(`/Users/sagnikpaul28/Documents/dc-wiki/client/src/img/logo/${fileName}.${fileExtension}`, function(err) {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
        });
    }

    //Insert wallpaper in file
    if (wallpaperFile){

        wallpaperFile.mv(`/Users/sagnikpaul28/Documents/dc-wiki/client/src/img/wallpapers/${fileName}.${fileExtension}`, function(err) {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
        });
    }

    res.send('success');
});

app.use('/', router);

//Error Handling
app.use(function(err, req, res, next) {
    if (err.name === "ValidationError"){
        res.status(422).send(err.message);
    }else {
        console.log(err);
    }
});


app.listen(process.env.port || 4000, function(){
    console.log('Node is running on port 4000');
});