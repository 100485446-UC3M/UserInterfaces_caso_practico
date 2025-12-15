function updateTourStars(stars, discoverComments){
    stars.empty();
    let rating = 0;
    for (var i = 0; i < discoverComments.length; i++){
        rating = rating + discoverComments[i]["rating"];
    }
    if (rating !== 0){
        rating = rating / discoverComments.length;
        rating = Math.round(rating);
    }
    
    for (var i = 0; i < rating; i++){
        stars.append('<span class="fa fa-star gold"></span> ');
    }
    for (var i = rating; i < 5; i++){
        stars.append('<span class="fa fa-star"></span> ');
    }
}

function updateGrid(filteredData, allData, allDiscover, username){
    const children = $("#explore-grid").children(".experience");
    for(var i = 0; i < children.length && i < filteredData.length; i++){
        const experience = children.eq(i);
        experience.css("visibility", "visible");
        const discover = filteredData[i];
        const card = experience.children(".experience-card");

        const index = allData.findIndex((x) => discover["name"] === x["name"])
        let link = "discover-info.html?discover=" + encodeURIComponent(index);
        if(username) link += "&username=" + encodeURIComponent(username);
        card.children("a").attr("href", link);
        card.children("a").children("img").attr("src", discover["image"]);
        card.children("h3").text(discover["name"]);

        const comments = allDiscover[discover["name"]] ?? [];
        updateTourStars(experience.children(".stars"), comments);
    }
    for(var i = i; i < children.length; i++){
        const experience = children.eq(i);
        experience.css("visibility", "hidden");
    }
}

$(function(){
    // se espera un username (string, opcional)
    // si se pasa un username se significa que está loggeado
    const params = new URLSearchParams(decodeURIComponent(window.location.search));
    const allDiscover = JSON.parse(localStorage.getItem("discoverComments") ?? "{}");
    const username = params.get("username");
    const lang = params.get("lang");

    
    const recommended_text = $(".left-container").children('h2');
    const search_text = $(".search-bar input[type='text']");
    $.getJSON("data/discover" + (lang ? "-ingles" : "") + ".json", function(data){
        updateGrid(searchName(data, search_text.val().trim()), data, allDiscover, username);
        search_text.keyup(function(){
            recommended_text.css("visibility", search_text.val().trim() === "" ? "visible" : "hidden");
            updateGrid(searchName(data, search_text.val().trim()), data, allDiscover, username);
        });
    });
});