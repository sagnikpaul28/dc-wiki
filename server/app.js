const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Import Schema
const Heroes = require("./model");

//Setup Router and Express Instance
const router = express.Router();
const app = express();


//Setup Mongoose
mongoose.connect("mongodb://localhost/dc");
mongoose.Promise = global.Promise;


//Setup BodyParser
app.use(bodyParser.json());


//Get All Heroes
router.get("/api/GetAllHeroes", function(req, res, next){
    Heroes.find({})
        .then(function(result){
            res.send(result);
        }).catch(next);
});

//Add A Hero
router.post("/api/AddNewHero", function(req, res, next){
    Heroes.create(req.body)
        .then(function(result){
            res.send(result);
        }).catch(next);
});

//Search for Heroes
router.get("/api/SearchAHero", function(req, res, next){
    Heroes.find({})
        .then(function(result){
            result = result.filter(obj => (obj.name.toLowerCase().indexOf(req.query.name.toLowerCase()) != -1 || obj.alias.toLowerCase().indexOf(req.query.name.toLowerCase()) != -1));
            res.send(result);
        }).catch(next);
});

//Delete a hero by name
router.delete("/api/DeleteByName", function(req, res, next){
    Heroes.findOneAndDelete({name: req.query.name})
        .then(function(result){
            res.send(result);
        }).catch(next);
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