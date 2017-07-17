var express = require("express");
var bodyParser = require("body-parser");
// var logger = require("morgan");
var mongoose = require("mongoose");
var methodOverride = require("method-override");


var NotesSchema = require("./models/Notes.js");
var Article = require("./models/Article.js");

// Create the Note model with the NoteSchema
var Note = mongoose.model("Notes", NotesSchema);


var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;


var app = express();

var PORT = process.env.PORT || 3000;

// app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));

mongoose.connect("mongodb://heroku_50gzk7f6:1k7njf6gaaklvc9jcgruj2en9g@ds137271.mlab.com:37271/heroku_50gzk7f6");
var db = mongoose.connection;

db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
});



app.get("/scrape", function(req, res) {
    console.log("GOT TO SCRAPE");
    var articles = [];
    request("http://www.nytimes.com/", function(error, response, html) {
        console.log("GOT TO REQUEST");


        var $ = cheerio.load(html);

        var newArticlesCount = 0;

        var lastchecked = true;
        var ready = [];

        $("article.story").each(function(i, element) {
            ready[i] = false;
            console.log("WE HAVE ARTICLE " + i);
            var result = {};

            result.title = $(this).children(".story-heading").children('a').text().trim();
            result.link = $(this).children(".story-heading").children('a').attr("href");
            result.authors = $(this).children(".byline").text().trim();
            result.date = $(this).children(".byline").children(".timestamp").attr("datetime");
            result.time = $(this).children(".byline").children(".timestamp").text().trim();
            result.summary = $(this).children(".summary").text().trim();
            result.isSaved = false;


            if(result.link != null && result.title != null && result.summary != ""){
                Article.count({ link: result.link }, function(error, countRes) {
                    // console.log("WE COUNTED");
                    if (error) {
                        console.log(error);
                    } else {
                        if (countRes === 0) {
                            var entry = new Article(result);
                            entry.save(function(err, doc) {
                                // console.log(JSON.stringify(result, null, 2));
                                // console.log("SAVE ATTEMPT");
                                if (err) {
                                    console.log(err);
                                } else {
                                    // console.log(doc);
                                    newArticlesCount++;
                                    ready[i] = true;
                                    if (!ready.includes(false)) {
                                        console.log("SENDING THAT I'M DONE");
                                        res.send(newArticlesCount.toString());
                                    }
                                }  
                                console.log(ready.toString());
                            }); 
                        } else {
                            ready[i] = true; 
                            if (!ready.includes(false)) {
                                console.log("SENDING THAT I'M DONE");
                                res.send(newArticlesCount.toString());
                            }
                        }
                    }
                });
            } else {
                ready[i] = true;
                if (!ready.includes(false)) {
                    console.log("SENDING THAT I'M DONE");
                    res.send(newArticlesCount.toString());
                }
            }
        });

    });
});

app.get("/articles", function(req, res) {
    console.log("HEY I AM GETTING ARTICLES");
    Article.find({}, function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            // console.log("YOYOYOYOYOYOYO");
            res.json(doc);
        }
    });
});

app.post("/articles", function(req, res) {
    Article.findOneAndUpdate({_id: req.body.id}, {$set:{isSaved: true}}, {new: true}, function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            console.log("HEY I SAVED AN ARTICLE");
            // console.log("YOYOYOYOYOYOYO");
            res.json(doc);
        }
    });
});

app.get("/saved", function(req, res){
    res.sendFile(__dirname + "/public/saved.html");
});

app.get("/savedarticles", function(req, res) {
    Article.find({ isSaved: true }, function(err, doc) {
        if (err) {
            console.log(error);
        } else {
            res.json(doc);
        }
    });
});

app.get("/savedarticles/:id", function(req, res) {
    Article.findOne({ "_id": req.params.id }, function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.json(doc);
        }
    });
});

app.post("/savedarticles/:id", function(req, res) {
    Article.findOne({ "_id": req.params.id }, function(error, article) {
        if (error) {
            console.log(error);
        } else {
            var newNote = new Note(req.body);
            article.notes.push(newNote);
            article.save(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(doc);
                    res.json(newNote);
                }
            });
        }
    });
});

app.delete("/savedarticles/:id", function(req, res){
    Article.findOne({ "_id": req.params.id }, function(error, article) {
        console.log("HI I AM FINDING AN ARTICLE");
        console.log(article);
        if (error) {
            // console.log(error);
        } else {
            article.notes.id(req.body.id).remove();
            article.save(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log(doc);
                    console.log("DELETING NOTE");
                    res.json(doc);
                }
            });
        }
    });
});

app.delete("/savedarticles", function(req, res) {
    Article.findOneAndUpdate({_id: req.body.id}, {$set:{isSaved: false}}, {new: true}, function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            console.log("HEY I DELETED AN ARTICLE");
            res.json(doc);
        }
    });
});

app.listen(PORT, function() {
    console.log("App running on port 3000!");
});
