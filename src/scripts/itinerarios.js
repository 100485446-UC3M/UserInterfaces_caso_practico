// requiere de search.js

let activities = [];

function saveActivities(username){
    const userInfo = JSON.parse(localStorage.getItem(username) ?? "{}");
    userInfo["itinerary"] = activities;
    localStorage.setItem(username, JSON.stringify(userInfo));
}

function addActivity(isTour, data_index, activityDOM, username){
    activities.push([isTour, data_index]);
    if(username) saveActivities(username);
    updateActivities(activityDOM, username);
}

function removeActivity(activity_index, activityDOM, username){
    activities = activities.filter((val, index) => index !== activity_index);
    if(username) saveActivities(username);
    updateActivities(activityDOM, username);
}

function updateActivities(activityDOM, username){
    const allTours = JSON.parse(localStorage.getItem("tourComments") ?? "{}");
    const allDiscovers = JSON.parse(localStorage.getItem("discoverComments") ?? "{}");
    $.getJSON("data/tours.json", function(tours){
        $.getJSON("data/discover.json", function(discovers){
            const activity_cont = $(".Actividad-container");
            activity_cont.empty();
            for(let i = 0; i < activities.length; i++){
                const act_data = activities[i][0] ? tours[activities[i][1]] : discovers[activities[i][1]];
                const day_act = activityDOM.clone();
                day_act.children("h3").text(i + 1);
                const act = day_act.children(".Actividad");
                act.children("img").attr("src", act_data["image"]);
                const details = act.children(".Actividad-Detalles");
                details.children("#act-title").text(act_data["name"]);
                details.children("#act-type").text(activities[i][0] ? "Tour" : "Por tu cuenta");
                if(activities[i][0]){
                    details.children("#act-price").text(act_data["price"] + "€");
                    updateStars(details.children(".stars"), allTours[act_data["name"]] ?? []);

                } else {
                    details.children("#act-price").css("visibility", "hidden");
                    updateStars(details.children(".stars"), allDiscovers[act_data["name"]] ?? []);
                }
                const actions = act.children(".Actividad-Acciones");
                actions.children(".eliminar-button").on("click", function(){
                    removeActivity(i, activityDOM, username);
                });
                actions.children(".expand-button").on("click", function(){
                    let link = "";
                    if(activities[i][0]){
                        link = "tour-info.html?tour=" + encodeURIComponent(activities[i][1]);
                    } else {
                        link = "discover-info.html?discover=" + encodeURIComponent(activities[i][1]);
                    }
                    if(username) link += "&username=" + encodeURIComponent(username);
                    window.location.href = link;
                });
                activity_cont.append(day_act);
            }
        });
    });
}

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

async function updateSearchResults(data, experience_grid, experienceDOM, activityDOM, username){
    const allTours = JSON.parse(localStorage.getItem("tourComments") ?? "{}");
    const allDiscovers = JSON.parse(localStorage.getItem("discoverComments") ?? "{}");

    experience_grid.empty();
    for (var i = 0; i < 6 && i < data.length; i++){
        const isTour = data[i]["price"] === undefined ? false : true;
        const comments = isTour ? allTours[data[i]["name"]] ?? [] : allDiscovers[data[i]["name"]] ?? [];
        const exp = experienceDOM.clone();
        const card = exp.children(".experience-card");

        let link = "";
        let index = 0;
        if(isTour){
            index = i;
            link = "tour-info.html?tour=" + encodeURIComponent(index);
        } else {
            await $.getJSON("data/discover.json", function(discovers){
                index = discovers.findIndex((x) => data[i]["name"] === x["name"])
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

        exp.children("button").on("click", function(){

            addActivity(isTour, index, activityDOM, username);
        });

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
    activities = JSON.parse(localStorage.getItem(username) ?? "{}")["itinerary"] ?? [];

    //Itinerario
    const activityDOM = $(".Dia-Actividad").clone();
    updateActivities(activityDOM, username);


    // Busqueda
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
            updateSearchResults(results, exp_grid, exp, activityDOM, username);

            search_bar.children("input[type='text']").keyup(function(){
                const results = searchName(toursData.concat(discoversData), search_bar.children("input").val().trim());

                updateSearchResults(results, exp_grid, exp, activityDOM, username);
            });
        });
    });
});