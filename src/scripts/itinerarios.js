// requiere de search.js

function updateStars(stars, comments){
    stars.empty();
    let rating = 0;
    for (var i = 0; i < comments.length; i++){
        rating = rating + comments[i]["rating"];
    }
    if (comments.length !== 0){
        rating = rating / comments.length;
        rating = Math.round(rating);
    }
    
    for (var i = 0; i < rating; i++){
        stars.append('<span class="fa fa-star gold"></span> ');
    }
    for (var i = rating; i < 5; i++){
        stars.append('<span class="fa fa-star"></span> ');
    }
}

async function updateSearchResults(data, experience_grid, experienceDOM, username){
    const allTours = JSON.parse(localStorage.getItem("tourComments") ?? "{}");
    const allDiscovers = JSON.parse(localStorage.getItem("discoverComments") ?? "{}");

    experience_grid.empty();
    for (var i = 0; i < 6 && i < data.length; i++){
        const isTour = data[i]["price"] === undefined ? false : true;
        const comments = isTour ? allTours[data[i]["name"]] ?? [] : allDiscovers[data[i]["name"]] ?? [];
        const exp = experienceDOM.clone();
        const card = exp.children(".experience-card");

        let link = "";
        if(isTour){
            link = "tour-info.html?tour=" + encodeURIComponent(i);
        } else {
            await $.getJSON("data/discover.json", function(discovers){
                const index = discovers.findIndex((x) => data[i]["name"] === x["name"])
                link = "discover-info.html?discover=" + encodeURIComponent(index);
            });
        }
        if(username) link += "&username=" + encodeURIComponent(username);
        card.children("a").attr("href", link);
        card.children("a").children("img").attr("src", data[i]["image"]);
        card.children("h3").text(data[i]["name"]);

        updateStars(exp.children(".stars"), comments);

        if(isTour){
            exp.children("h3").text(" " + data[i]["price"] + "€");
        } else {
            exp.children("h3").text("Por tu cuenta");
        }
        experience_grid.append(exp);
    }
    for (var i = i; i < 6; i++){
        const exp = experienceDOM.clone();
        exp.css("visibility", "hidden");
        experience_grid.append(exp);
    }
}

$(function(){
    // se espera un username (string, opcional)
    // si se pasa un username se significa que está loggeado
    const params = new URLSearchParams(decodeURIComponent(window.location.search));
    const username = params.get("username");

    var toursData = []
    var discoversData = []
    const search_bar = $(".search-bar");
    const exp_grid = $(".experience-grid");
    const exp = exp_grid.children(".experience").first().clone();
    $.getJSON("data/tours.json", function(tours){
        toursData = tours;
        $.getJSON("data/discover.json", function(discovers){
            discoversData = discovers;
            const results = searchName(toursData.concat(discoversData), search_bar.children("input").val().trim());
            updateSearchResults(results, exp_grid, exp, username);

            search_bar.children("input[type='text']").keyup(function(){
                const results = searchName(toursData.concat(discoversData), search_bar.children("input").val().trim());

                updateSearchResults(results, exp_grid, exp, username);
            })
        });
    });
});