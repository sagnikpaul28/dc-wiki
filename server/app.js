const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fileUpload = require('express-fileupload');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary');
const path = require('path');

//Setup Mongoose
mongoose.connect("mongodb://sagnikpaul:SagnikPaul28@ds145562.mlab.com:45562/dc-wiki");
mongoose.Promise = global.Promise;


//Setup Cloudinary
cloudinary.config({
    cloud_name: 'dc-wiki',
    api_key: '773376688586365',
    api_secret: 'oQ89UWb4ik1sVJZNuRwAVqo4DpA'
});

//Setup Multer
const upload = multer({
    storage: multer.diskStorage({})
});


//Authorization Token
let authorization = 'IAmBatman';

//Import Schema
const Heroes = require("./model");

//Setup Router and Express Instance
const router = express.Router();
const app = express();

app.use(cors());


//Setup BodyParser
app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//Get Name in Ascending or Descending Order
function compareAsc(a, b) {
    if (a.name > b.name) {
        return 1;
    } else if (a.name < b.name) {
        return -1;
    }
    return 0;
}
function compareDesc(a, b) {
    if (a.name > b.name) {
        return -1;
    } else if (a.name < b.name) {
        return 1;
    }
    return 0;
}

/*
Get All Heroes
Key = Name, Sort = ASC for ascending order of name
Key = Name, Sort = DESC for descending order of name
*/
router.get("/api/GetAllHeroes", function (req, res, next) {
    if (req.header('Authorization') !== authorization) {
        res.status(401).send('Incorrect Authorization Token');
    } else {
        Heroes.find({})
            .then(function (result) {
                if (req.query.key) {
                    if (req.query.key.toLowerCase() === 'name') {
                        if (req.query.sort.toLowerCase() === 'asc') {
                            result.sort(compareAsc);
                        } else if (req.query.sort.toLowerCase() === 'desc') {
                            result.sort(compareDesc);
                        }
                    }
                }
                res.send(result);
            }).catch(next);
    }
});

//Add A Hero
router.post("/api/AddNewHero", function (req, res, next) {
    if (req.header('Authorization') !== authorization) {
        res.status(401).send('Incorrect Authorization Token');
    } else {
        Heroes.create(req.body)
            .then(function (result) {
                res.send(result);
            }).catch(next);
    }
});

//Update A Hero by its url
router.post("/api/UpdateAHero", function (req, res, next) {
    if (req.header('Authorization') !== authorization) {
        res.status(401).send('Incorrect Authorization Token');
    } else {
        let url = req.body.actualUrl;
        Heroes.findOneAndUpdate({ url: url }, req.body)
            .then(function (result) {
                res.send(result);
            }).catch(next);
    }
});

//Search for Heroes
router.get("/api/SearchAHero", function (req, res, next) {
    if (req.header('Authorization') !== authorization) {
        res.status(401).send('Incorrect Authorization Token');
    } else {
        Heroes.find({})
            .then(function (result) {
                let query = req.query.name;
                if (query) {
                    result = result.filter(obj => {
                        return (obj.name.toLowerCase().indexOf(query.toLowerCase()) != -1)
                            || (obj.alias != null ? (obj.alias.toLowerCase().indexOf(query.toLowerCase()) != -1) : false)
                    });
                }
                res.send(result);
            }).catch(next);
    }
});

//Get Hero By Url
router.get("/api/GetHeroByUrl", function (req, res, next) {
    if (req.header('Authorization') !== authorization) {
        res.status(401).send('Incorrect Authorization Token');
    } else {
        Heroes.find({})
            .then(function (result) {
                result = result.filter(obj => {
                    return obj.url === req.query.name.toLowerCase();
                });
                res.send(result);
            }).catch(next);
    }
});

//Delete a hero by url
router.delete("/api/DeleteByUrl", function (req, res, next) {
    if (req.header('Authorization') !== authorization) {
        res.status(401).send('Incorrect Authorization Token');
    } else {

        let characterImage = req.body.characterImage;
        characterImagePublicId = characterImage.substring(characterImage.indexOf('characters/'), characterImage.lastIndexOf('.'));

        let wallpaperImage = req.body.wallpaperImage;
        wallpaperImagePublicId = wallpaperImage.substring(wallpaperImage.indexOf('wallpapers/'), wallpaperImage.lastIndexOf('.'));

        cloudinary.v2.uploader.destroy(characterImagePublicId, function (error, result) {
            if (error) {
                res.status(500).json({ error: "Error -> " + error });
                return;
            } else {
                cloudinary.v2.uploader.destroy(wallpaperImagePublicId, function (error, result) {
                    if (error) {
                        res.status(500).json({ error: "Error -> " + error });
                        return;
                    } else {
                        Heroes.findOneAndDelete({ url: req.query.url })
                            .then(function (result) {
                                res.send(result);
                            }).catch(next);
                    }
                });
            }
        });
    }
});

//Upload Images
app.post("/api/UploadImage", upload.fields([{ name: 'fileImage' }, { name: 'wallpaperImage' }]), function (req, res, next) {
    if (req.header('Authorization') !== authorization) {
        res.status(401).send('Incorrect Authorization Token');
    } else {

        let imageFile = req.files.fileImage;
        let wallpaperFile = req.files.wallpaperImage;
        let fileName = req.body.fileName;

        let wallpaperUrl = '';
        let imageUrl = '';

        let count = (imageFile ? 1 : 0) + (wallpaperFile ? 1 : 0);
        let tempcount = 0;

        //insert images in file
        if (imageFile) {

            cloudinary.v2.uploader.upload(
                imageFile[0].path, {
                    public_id: 'characters/' + fileName,
                    invalidate: true
                },
                function (error, result) {
                    if (error) {
                        res.status(500).json({ error: "Error -> " + error });
                        return;
                    } else {
                        imageUrl = result.url;
                        tempcount++;

                        if (count === tempcount) {
                            res.status(200).json({
                                imageUrl: imageUrl,
                                wallpaperUrl: wallpaperUrl
                            });
                        }
                    }
                });

        }

        //Insert wallpaper in file
        if (wallpaperFile) {

            cloudinary.v2.uploader.upload(
                wallpaperFile[0].path, {
                    public_id: 'wallpapers/' + fileName,
                    invalidate: true
                },
                function (error, result) {
                    if (error) {
                        res.status(500).json({ error: "Error -> " + error });
                    } else {
                        wallpaperUrl = result.url;
                        tempcount++;
                        
                        if (count === tempcount) {
                            res.status(200).json({
                                imageUrl: imageUrl,
                                wallpaperUrl: wallpaperUrl
                            });
                        }
                    }
                });
        }
        
    }
});

router.post("/api/CheckPassword", function (req, res, next) {
    if (req.body.message === 'IAmBatman') {
        res.status(200).send('okay');
    } else {
        res.status(403).send('incorrect password');
    }
});

app.use('/', router);

//Error Handling
app.use(function (err, req, res, next) {
    if (err.name === "ValidationError") {
        res.status(422).send(err.message);
    } else {
        console.log(err);
    }
});


app.listen(process.env.Port || 4000, function () {
    console.log('Node is running on port 4000');
});