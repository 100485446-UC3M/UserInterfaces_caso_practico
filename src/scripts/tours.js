function updateTourStars(stars, tourComments){
    console.log(stars);
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

$(function(){
    // se espera un username (string, opcional)
    // si se pasa un username se significa que está loggeado
    const params = new URLSearchParams(decodeURIComponent(window.location.search));
    const allTours = JSON.parse(localStorage.getItem("tourComments") ?? "{}");
    const username = params.get("username");
    const userInfo = JSON.parse(localStorage.getItem(username) ?? "{}");
    $.getJSON("data/tours.json", function(data){
        const children = $("#explore-grid").children(".experience");
        for(let i = 0; i < children.length; i++){
            const experience = children.eq(i);
            const tour = data[i];
            const card = experience.children(".experience-card");

            let link = "tour-info.html?tour=" + encodeURIComponent(i);
            if(username) link += "&username=" + encodeURIComponent(username);
            card.children("a").attr("href", link);
            card.children("img").attr("src", tour["image"]);
            card.children("h3").text(tour["name"]);

            const comments = allTours[tour["name"]] ?? [];
            updateTourStars(experience.children(".stars"), comments);

            experience.children("h3").text(" " + tour["price"] + "€");
        }
    });
});