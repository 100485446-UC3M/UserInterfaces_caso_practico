$(function(){
    const params = new URLSearchParams(decodeURIComponent(window.location.search));
    const username = params.get("username");

    if (!username) return;

    const userInfo = JSON.parse(localStorage.getItem(username) ?? "{}");
    const container = $(".perfil-container");
    container.children("img").attr("src", userInfo["image"]);
    const links = container.children(".perfil-links");
    links.empty();
    links.append('<a href="perfil.html?username='
        + encodeURIComponent(username) + '" class="perfil-link">Perfil</a>');
});