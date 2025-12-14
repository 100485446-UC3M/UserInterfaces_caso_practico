function updateTourStars(stars, tourComments){
    stars.empty();
    let rating = 0;
    for (var i = 0; i < tourComments.length; i++){
        rating = rating + tourComments[i]["rating"];
    }
    if (rating !== 0){
        rating = rating / tourComments.length;
        rating = Math.round(rating);
    }
    
    for (var i = 0; i < rating; i++){
        stars.append('<span class="fa fa-star gold"></span> ');
    }
    for (var i = rating; i < 5; i++){
        stars.append('<span class="fa fa-star"></span> ');
    }
}

function updateRecommendGrid(filteredData, allData, allTours, username){
    const children = $("#recommend-grid").children(".experience");
    for(var i = 0; i < children.length && i < filteredData.length; i++){
        const experience = children.eq(i);
        const tour = filteredData[i];
        const card = experience.children(".experience-card");

        const index = allData.findIndex((x) => tour["name"] === x["name"])
        let link = "tour-info.html?tour=" + encodeURIComponent(index); //
        if(username) link += "&username=" + encodeURIComponent(username);
        card.children("a").attr("href", link);
        card.children("a").children("img").attr("src", tour["image"]);
        card.children("h3").text(tour["name"]);

        const comments = allTours[tour["name"]] ?? [];
        updateTourStars(experience.children(".stars"), comments);

        experience.children("h3").text(" " + tour["price"] + "€");
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
    const allTours = JSON.parse(localStorage.getItem("tourComments") ?? "{}");
    const username = params.get("username");
    const userInfo = JSON.parse(localStorage.getItem(username) ?? "{}");
    $.getJSON("data/tours.json", function(data){
        updateRecommendGrid(data, data, allTours, username);

        const left_container = $(".left-container");
        const no_search_results = $("#no-search-results").clone();
        const search_text = $(".search-bar input[type='text']");
        const recommend_grid = $("#recommend-grid").clone();
        recommend_grid.append($(".experience").clone());
        search_text.keyup(function(){
            if(search_text.val().trim() === ""){
                $("#no-search-results").remove();
                left_container.append(no_search_results.clone());
            } else {
                const results = searchName(data, search_text.val().trim());
                $("#no-search-results").empty();
                $("#no-search-results").append(recommend_grid.clone());
                updateRecommendGrid(results, data, allTours, username);
            }
        });
    });
});