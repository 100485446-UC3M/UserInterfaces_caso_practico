$(function(){
    // se espera un tour(indice del array de tours), y un username (string, opcional)
    // si se pasa un username se significa que está loggeado
    const params = new URLSearchParams(decodeURIComponent(window.location.search));
    const username = params.get("username");
    const tour_index = params.get("tour");

    const cancel = $(".form-container a");
    let link = "tour-info.html?tour=" + encodeURIComponent(tour_index);
    if(username) link += "&username=" + encodeURIComponent(username);
    cancel.attr("href", link);

    $(".form-container").submit(function(e){
        e.preventDefault();

        alert("Compra realizada con exito");
        let link = "inicio.html";
        if(username) link += "?username=" + encodeURIComponent(username);
        window.location.href = link;
        return false;
    });
});