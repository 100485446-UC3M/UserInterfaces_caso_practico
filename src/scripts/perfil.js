$(function(){
    const params = new URLSearchParams(decodeURIComponent(window.location.search));
    const username = params.get("username");
    const userInfo = JSON.parse(localStorage.getItem(username) ?? "{}");
    $("#profile-pic").attr("src", userInfo["image"]);
    $("#username").text(username);
    $("#name").text(userInfo["name"] + " " + userInfo["surnames"]);
    $("#email").text(userInfo["email"]);
    $("#city").text(userInfo["city"]);

    const comments_container = $("#dynamic-comments");
    const commentDOM = comments_container.children(".comment");

    const tourComments = JSON.parse(localStorage.getItem("tourComments") ?? "{}");
    const discoverComments = JSON.parse(localStorage.getItem("discoverComments") ?? "{}");

    $.getJSON("data/tours.json", function(tours){
        $.getJSON("data/discover.json", function(discovers){
            const user_comments = []
            for (const [tour_name, comments] of Object.entries(tourComments)){
                for (let i = 0; i < comments.length; i++){
                    if(comments[i]["username"] === username){
                        const tour_index = tours.findIndex((x) => tour_name === x["name"]);
                        user_comments.push([comments[i], "tour-info.html?tour=" + tour_index.toString()]);
                    }
                }
            }
            for (const [discover_name, comments] of Object.entries(discoverComments)){
                for (let i = 0; i < comments.length; i++){
                    if(comments[i]["username"] === username){
                        const discover_index = discovers.findIndex((x) => discover_name === x["name"]);
                        user_comments.push([comments[i], "discover-info.html?discover=" + discover_index.toString()]);
                    }
                }
            }
            user_comments.sort((a,b) => {
                a_rev = a[0]["date"].split("/").reverse();
                b_rev = b[0]["date"].split("/").reverse();
                return a_rev < b_rev ? -1 : 1
            });
            
            comments_container.empty();
            for(let i = 0; user_comments.length; i++){
                const comment = commentDOM.clone();
                comment.attr("href", user_comments[i][1] + "&username=" + encodeURIComponent(username));
                comment.children(".top-row").children(".username").text(user_comments[i][0]["username"]);
                comment.children(".top-row").children(".date").text(user_comments[i][0]["date"]);
                comment.children(".bottom-row").children("img").attr("src", user_comments[i][0]["image"]);
                comment.children(".bottom-row").children("p").text(user_comments[i][0]["text"]);

                const rating = user_comments[i][0]["rating"];
                const stars = comment.children(".top-row").children(".stars");
                stars.empty();
                for (let j = 0; j < rating; j++){
                    stars.append('<span class="fa fa-star gold"></span> ');
                }
                for (let j = rating; j < 5; j++){
                    stars.append('<span class="fa fa-star"></span> ');
                }

                comments_container.append(comment);
            }
        });
    });
});