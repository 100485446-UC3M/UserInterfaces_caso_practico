$(function(){
    // se espera un username (string, opcional)
    // si se pasa un username se significa que está loggeado
    const params = new URLSearchParams(decodeURIComponent(window.location.search));
    const username = params.get("username");

    const menu_links = $("header a");
    menu_links.each(function(){
        if(!username) return;
        let link = $(this).attr("href");
        link += "?username=" + encodeURIComponent(username);
        $(this).attr("href", link);
    });
});
$(document).ready(function () {
    $(".menu-toggle").click(function () {
        $(".menu").toggleClass("active");
    });

     $(".menu-close").click(function () {
        $(".menu").removeClass("active");
    });

    $(".menu a").click(function () {
        $(".menu").removeClass("active");
    });
});