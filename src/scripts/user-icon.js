$(function(){
    const params = new URLSearchParams(decodeURIComponent(window.location.search));
    const username = params.get("username");

    if (!username) return;

    const userInfo = JSON.parse(localStorage.getItem(username) ?? "{}");
    const container = $("#user-icon");
    container.children("a").attr("href", "perfil.html?username=" + encodeURIComponent(username));
    container.children("a").children("img").attr("src", userInfo["image"]);
    const links = container.children("p");
    links.empty();
    links.append('<a href="perfil.html?username='
        + encodeURIComponent(username) + '" class="perfil-link">Perfil</a>');
});