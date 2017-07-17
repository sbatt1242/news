// Grab the articles as a json
$.getJSON("/savedarticles", function(data) {
    // For each one
    $("#articles").empty();
    console.log("I HAVE " + data.length + " ARTICLES");
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append("<div class='article-div' data-id='" + data[i]._id + "'><div class='article-top-div'><a href='" + data[i].link + "'>" + data[i].title + "</a><button type='button' class='add-notes-modal btn btn-primary' data-toggle='modal' data-target='#modalForm'>ARTICLE NOTES</button><button class='delete-article btn btn-danger'>DELETE FROM SAVED</button></div><div class='article-bottom-div'><p class='article-summary'>" + data[i].summary + "</p></div>");
    }
});


$(document).on("click", ".add-notes-modal", function() {
    // Grab the id associated with the article from the button's parent(x2) div
    var thisId = $(this).parent().parent().attr("data-id");
    var modalNotes = $("#modalNotes");

    modalNotes.empty();

    $("#modalForm").attr("data-id", thisId);
    $("#modalLabel").text("Notes For Article: " + thisId);
    $.ajax({
            method: "GET",
            url: "/savedarticles/" + thisId
        })
        // With that done
        .done(function(data) {
            // Log the response
            console.log(data);
            for(var i = 0; i < data.notes.length; i ++){
                modalNotes.append("<div class='modal-article-note text-center' data-article-id=" + thisId + " data-note-id='" + data.notes[i]._id + "'><p class='note-text'>" + data.notes[i].text + "<button type='button' class='btn btn-danger removeNote pull-right'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button></p></div>");
            }
        });
});

$(document).on("click", "#saveNote", function(){
    var noteText = $("#noteInput").val();
    var thisId = $("#modalForm").attr("data-id");
    var modalNotes = $("#modalNotes");
    $("#noteInput").val('');
    $.ajax({
        method: "POST",
        url: "/savedarticles/" + thisId,
        data: {
            text: noteText
        }
    })
    // With that done
    .done(function(data) {
        // Log the response
        console.log(data);
        modalNotes.append("<div class='modal-article-note text-center center-block' data-article-id=" + thisId + " data-note-id='" + data._id + "'><p class='note-text'>" + data.text + "<button type='button' class='btn btn-danger removeNote pull-right'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button></p></div>");

    });

});

$(document).on("click", ".removeNote", function(){
    console.log("YO I CLICKED REMOVE NOTE");
    var noteDiv = $(this).parent().parent();
    var noteId = noteDiv.attr("data-note-id");
    var articleId = noteDiv.attr("data-article-id");
    console.log(noteDiv);

    $.ajax({
        method: "POST",
        url: "/savedarticles/" + articleId + "?_method=DELETE",
        data: {
            id: noteId
        }
    })
    .done(function(data){
        noteDiv.remove();
        console.log(data);
    });
});

$(document).on("click", ".delete-article", function() {
    // Grab the id associated with the article from the button's parent(x2) div
    var mainDiv = $(this).parent().parent();
    var thisId = mainDiv.attr("data-id");

    // Run a POST request to change the article to saved, using the article id
    $.ajax({
            method: "POST",
            url: "/savedarticles?_method=DELETE",
            data: {
                id: thisId
            }
        })
        // With that done
        .done(function(data) {
            // Log the response
            mainDiv.remove();
            console.log(data);
        });
});

// When you click the delete-article button
$(document).on("click", ".delete-article", function() {
    // Grab the id associated with the article from the button's parent(x2) div
    var thisId = $(this).parent().parent().attr("data-id");

    // Run a POST request to delete the article, using the article id
    $.ajax({
            method: "POST",
            url: "/savedarticles?_method=DELETE",
            data: {
                id: thisId
            }
        })
        // With that done
        .done(function(data) {
            // Log the response
            console.log(data);
        });
});