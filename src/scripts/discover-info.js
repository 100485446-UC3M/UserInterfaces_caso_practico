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

function updateStars(discoverComments){
    const stars = $(".main-container .stars");
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

function updateCommentList(discoverComments, commentDOM, isLoggedIn) {
    const comments = $(".comments-container");
    comments.find(".comment").remove();
    for (var i = 0; i < discoverComments.length; i++){
        const comm = commentDOM.clone();
        const topRow = comm.children(".top-row");
        const username = discoverComments[i]["username"];
        topRow.children(".username").text(username);
        const stars = topRow.children(".comment .stars");
        stars.empty();
        const rating = discoverComments[i]["rating"];
        for (var j = 0; j < rating; j++){
            stars.append('<span class="fa fa-star gold"></span> ');
        }
        for (var j = rating; j < 5; j++){
            stars.append('<span class="fa fa-star"></span> ');
        }
        topRow.children(".date").text(discoverComments[i]["date"]);
        const bottomRow = comm.children(".bottom-row");
        const userInfo = JSON.parse(localStorage.getItem(username));
        bottomRow.children("img").attr("src", userInfo["image"]);
        bottomRow.children("p").text(discoverComments[i]["text"]);
        comments.append(comm);
    }
    if(isLoggedIn) comments.append($('.comment-input'));
    updateStars(discoverComments);
}

$(function(){
    //usamos los DOM en el html por defecto como plantilla
    const commentDOM = $(".comment").clone();
    // se espera un discover(indice del array de tours), y un username (string, opcional)
    // si se pasa un username se significa que está loggeado
    const params = new URLSearchParams(decodeURIComponent(window.location.search));
    const username = params.get("username");
    const userInfo = JSON.parse(localStorage.getItem(username) ?? "{}");
    $.getJSON("data/discover.json", function(data){
        //todo lo que necesite discoverInfo debe estar dentro de esta funcion
        const discoverInfo = data[params.get("discover")];
        const allDiscovers = JSON.parse(localStorage.getItem("discoverComments") ?? "{}")
        const discoverComments = allDiscovers[discoverInfo["name"]] ?? [];

        updateCommentList(discoverComments, commentDOM, username);

        $(".tour-name").text(discoverInfo["name"]);
        $(".tour-image").attr("src", discoverInfo["image"]);
        $(".description").text(discoverInfo["description"]);

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

            discoverComments.push({
                "username": username,
                "rating": rating,
                "text": textInput.val().trim(),
                "date": new Date().toLocaleDateString()
            });
            allDiscovers[discoverInfo["name"]] = discoverComments;
            localStorage.setItem("discoverComments", JSON.stringify(allDiscovers));

            updateCommentList(discoverComments, commentDOM, username);

            textInput.val('');
            ratingInput.prop("checked", false);
            $('input[value="-1"]').prop("checked", true);
            return false;
        });
    });
});