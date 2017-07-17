// Require mongoose
var mongoose = require("mongoose");
var NotesSchema = require("./Notes.js")
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
    // title is a required string
    title: {
        type: String,
        required: true
    },
    // link is a required string
    link: {
        type: String,
        required: true
    },

    authors: {
        type: String
    },

    date: {
        type: String
    },

    time: {
        type: String
    },

    summary: {
        type: String
    },

    isSaved: {
        type: Boolean
    },

    notes: [
    // {
    //     type: Schema.Types.ObjectId,
    //     ref: "Note"
    // }
    NotesSchema]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
