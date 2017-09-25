var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var Note = require('../models/Note.js');
var Article = require('../models/Article.js');

mongoose.connect("mongodb://localhost/readaboutit");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Successfully Connected to Mongoose");
});


router.get("/", function (req, res) {
    Article.find({}, function(error, doc) {
        var hbsObject = {
            Article: doc
        };
        res.render("index", hbsObject);
    });
});

router.get("/saved", function(req, res) {
    Article.find({"saved": true}, function(error, doc) {
      if (error) {
        console.log(error);
      }
      else {
        res.render("savedArticles")
      }
    });
  });

router.put("/articles/:id", function (req, res) {
    Article.findOneAndUpdate({_id:`"${req.params.id}"` }, {$set:{saved: true}})
    .exec(function(err, doc) {
      if (err) {
        console.log(err);
      }
      else {
        res.save(doc);
        console.log(doc);
      }
    });
});

router.get("/scrape", function(req, res) {
    request("https://www.reuters.com/", function(error, response, html) {

      var $ = cheerio.load(html);

      $(".article-heading").each(function(i, element) {

        var result = {};
 
        result.title = $(this).children("a").text();
        result.link = "https://www.reuters.com" + $(this).children("a").attr("href");

        var entry = new Article(result);
 
        entry.save(function(err, doc) {
          if (err) {
            console.log(err);
          }
          else {
            console.log(doc);
          }
        });
  
      });
    });
    res.redirect("/");
  });
  
  router.get("/articles", function(req, res) {
    Article.find({}, function(error, doc) {
      if (error) {
        console.log(error);
      }
      else {
        res.json(doc);
      }
    });
  });

  router.get("/articles/:id", function(req, res) {
    Article.findOne({ "_id": req.params.id })
    .populate("note")
    .exec(function(error, doc) {
      if (error) {
        console.log(error);
      }
      else {
        res.json(doc);
      }
    });
  });

  router.post("/articles/:id", function(req, res) {
    var newNote = new Note(req.body);

    newNote.save(function(error, doc) {
      if (error) {
        console.log(error);
      }
      else {
        Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
        .exec(function(err, doc) {
          if (err) {
            console.log(err);
          }
          else {
            res.send(doc);
          }
        });
      }
    });
  });

  module.exports = router;