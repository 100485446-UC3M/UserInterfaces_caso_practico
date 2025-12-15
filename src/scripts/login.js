$(function(){
    $("#register-form").submit(function(e){
        e.preventDefault();

        const username = $("#Usuario").val().trim();
        if(localStorage.getItem(username) === null){
            alert("El usuario no existe");
            return false;
        }

        const password = $("#password").val().trim();
        if(JSON.parse(localStorage.getItem(username))["password"] !== password){
            alert("La contraseña no es correcta");
            return false;
        }

        window.location.href = "inicio.html?username=" + encodeURIComponent(username);
    });
});