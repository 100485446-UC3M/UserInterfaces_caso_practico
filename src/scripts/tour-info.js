function updateCommentList(tourComments, commentInputDOM, commentDOM) {
    const comments = $(".comments-container");
    comments.empty();
    for (var i = tourComments.length - 1; i > tourComments - 1; i--){
        const comm = commentDOM.clone();
        const topRow = comm.children(".top-row");
        const username = tourComments[i]["username"];
        topRow.children(".username").text(username);
        const stars = topRow.children(".stars");
        stars.empty();
        const rating = tourComments[i]["rating"];
        for (var j = 0; rating; i++){
            stars.append('<span class="fa fa-star gold"></span>');
        }
        for (var j = rating; j < 5; j++){
            stars.append('<span class="fa fa-star"></span>');
        }
        topRow.children(".date").text(tourComments[i]["date"]);
        const bottomRow = comm.children(".bottom-row");
        const userInfo = JSON.parse(localStorage.getItem(username));
        bottomRow.children("img").attr("src", userInfo["image"]);
        bottomRow.children("p").text(tourComments[i]["text"]);
        comments.append(comm);
    }
    comments.append(commentInputDOM);
}

$(function(){
    const commentInputDOM = $(".comment-input").clone();
    const commentDOM = $(".comment").clone();
    const params = new URLSearchParams(decodeURIComponent(window.location.search))
    const username = params.get("username"); //might change the name of the key
    const userInfo = JSON.parse(localStorage.getItem(username) ?? "{}");
    const tourComments = JSON.parse(localStorage.getItem("tourComments") ?? "{}");

    updateCommentList(tourComments, commentInputDOM, commentDOM);
});