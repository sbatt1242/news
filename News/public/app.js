// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    $("#articles").empty();
    console.log("I HAVE " + data.length + " ARTICLES");
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append("<div class='article-div' data-id='" + data[i]._id + "'><div class='article-top-div'><a href='" + data[i].link + "'>" + data[i].title + "</a><button type='button' class='add-article btn btn-primary'>SAVE ARTICLE</button></div><div class='article-bottom-div'><p class='article-summary'>" + data[i].summary + "</p></div>");
    }
});


$(document).on("click", "#scrapeButton", function() {
    console.log("CLICKED");
    $.ajax("/scrape").done(function(scrapeData){
        console.log("YO IM DONE");
        $.getJSON("/articles", function(data) {
            // For each one
            $("#articles").empty();
            for (var i = 0; i < data.length; i++) {
                // Display the apropos information on the page
                $("#articles").append("<div class='article-div' data-id='" + data[i]._id + "'><div class='article-top-div'><a href='" + data[i].link + "'>" + data[i].title + "</a><button type='button' class='add-article btn btn-primary'>SAVE ARTICLE</button></div><div class='article-bottom-div'><p class='article-summary'>" + data[i].summary + "</p></div>");
            }
            console.log("There are " + scrapeData + " new Articles that have been scraped!");
        });

    })
});


// When you click the add-article button
$(document).on("click", ".add-article", function() {
    // Grab the id associated with the article from the button's parent(x2) div
    var thisId = $(this).parent().parent().attr("data-id");

    // Run a POST request to change the article to saved, using the article id
    $.ajax({
            method: "POST",
            url: "/articles",
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
