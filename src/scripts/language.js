$(function(){
    $("#lang-icon").click(function(){
        window.location.href = window.location.href + (window.location.href.includes("?") ? "&lang=en" : "?lang=en");
    });
});