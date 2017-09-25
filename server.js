var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cheerio = require("cheerio")
var request = require("request");
var routes = require('./controllers/scrape.js');

var app = express();

var port = process.env.PORT || 8000;

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));


app.use('/', routes);



  app.listen(port, function() {
    console.log("App running on port 8000");
  });
