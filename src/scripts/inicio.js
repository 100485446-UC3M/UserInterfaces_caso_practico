$(function(){
    // se espera un username (string, opcional)
    // si se pasa un username se significa que está loggeado
    const params = new URLSearchParams(decodeURIComponent(window.location.search));
    const username = params.get("username");

    $(".super-container a").each(function(){
        let link = $(this).attr("href");
        if(username) link += "?username=" + encodeURIComponent(username);
        $(this).attr("href", link);
    });
});