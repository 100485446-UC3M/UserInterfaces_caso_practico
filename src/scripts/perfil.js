$(function(){
    const params = new URLSearchParams(decodeURIComponent(window.location.search));
    const username = params.get("username");
    const userInfo = JSON.parse(localStorage.getItem(username) ?? "{}");
    $("#profile-pic").attr("src", userInfo["image"]);
    $("#username").text(username);
    $("#name").text(userInfo["name"] + " " + userInfo["surnames"]);
    $("#email").text(userInfo["email"]);
    $("#city").text(userInfo["city"]);
});