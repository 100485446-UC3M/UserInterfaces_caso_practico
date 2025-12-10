// ATENCION
// ATENCION
// ATENCION
// ATENCION
// ATENCION
// ATENCION
// ATENCION
// ATENCION
// ATENCION mirar el comentario de abajo
// ATENCION descomentarlo cuando sea apropiado
// ATENCION
// ATENCION
// ATENCION
// ATENCION
// ATENCION
// ATENCION
// ATENCION

function updateStars(tourComments){
    const stars = $(".main-container .stars");
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

function updateCommentList(tourComments, commentDOM, isLoggedIn) {
    const comments = $(".comments-container");
    comments.find(".comment").remove();
    for (var i = 0; i < tourComments.length; i++){
        const comm = commentDOM.clone();
        const topRow = comm.children(".top-row");
        const username = tourComments[i]["username"];
        topRow.children(".username").text(username);
        const stars = topRow.children(".comment .stars");
        stars.empty();
        const rating = tourComments[i]["rating"];
        for (var j = 0; j < rating; j++){
            stars.append('<span class="fa fa-star gold"></span> ');
        }
        for (var j = rating; j < 5; j++){
            stars.append('<span class="fa fa-star"></span> ');
        }
        topRow.children(".date").text(tourComments[i]["date"]);
        const bottomRow = comm.children(".bottom-row");
        const userInfo = JSON.parse(localStorage.getItem(username));
        //comentado hasta que se implementen usuarios
        //bottomRow.children("img").attr("src", userInfo["image"]);
        bottomRow.children("p").text(tourComments[i]["text"]);
        comments.append(comm);
    }
    if(isLoggedIn) comments.append($('.comment-input'));
    updateStars(tourComments);
}

$(function(){
    //usamos los DOM en el html por defecto como plantilla
    const commentDOM = $(".comment").clone();
    // se espera un tour(indice del array de tours), y un username (string, opcional)
    // si se pasa un username se significa que está loggeado
    const params = new URLSearchParams(decodeURIComponent(window.location.search))
    const username = params.get("username");
    const userInfo = JSON.parse(localStorage.getItem(username) ?? "{}");
    $.getJSON("data/tours.json", function(data){
        //todo lo que necesite tourInfo debe estar dentro de esta funcion
        const tourInfo = data[params.get("tour")];
        const allTours = JSON.parse(localStorage.getItem("tourComments") ?? "{}")
        const tourComments = allTours[tourInfo["name"]] ?? [];

        updateCommentList(tourComments, commentDOM, username);

        $(".tour-name").text(tourInfo["name"]);
        $(".tour-image").attr("src", tourInfo["image"]);
        $(".price").text(tourInfo["price"] + "€");
        $(".description").text(tourInfo["description"]);

        if(!username) {
            $('.comment-input').remove();
            return;
        }

        $('.comment-input form').submit(function(e){
            e.preventDefault();

            const textInput = $('input[name="comment"]');
            const ratingInput = $('input[name="star-rating"]:checked');

            const rating = Number(ratingInput.val());
            if (rating === -1){
                alert("Puntuación no seleccionada");
                return false;
            }

            tourComments.push({
                "username": username,
                "rating": rating,
                "text": textInput.val().trim(),
                "date": new Date().toLocaleDateString()
            });
            allTours[tourInfo["name"]] = tourComments;
            localStorage.setItem("tourComments", JSON.stringify(allTours));

            updateCommentList(tourComments, commentDOM, username);

            textInput.val('');
            ratingInput.prop("checked", false);
            $('input[value="-1"]').prop("checked", true);
            return false;
        });
    });
});