$(function(){
    $("#privacy-check").change(function() {
        $("#submitBtn").prop("disabled", !this.checked); // Habilita o deshabilita el botón según el checkbox
    });

    $("#register-form").submit(function(e){
        e.preventDefault();

        const nombre = $("#Nombre").val().trim();
        const apellidos = $("#Apellido").val().trim()
        const apellidosPartes = apellidos.split(/\s+/); //Se utiliza regex para considerar múltiples espacios
        const email = $("#email").val().trim();
        const emailconfirm = $("#emailconfirm").val().trim();
        const birthday = $("#birthday").val().trim();
        const city = $("#Ciudad").val().trim();
        const login = $("#login").val().trim();
        const password = $("#password").val().trim();
        const foto = $("#foto").prop("files")[0];

        if (nombre.length < 3) {
            alert("El nombre debe tener al menos 3 carácteres.");
            return false;
        }

        if (apellidosPartes.length < 2 || apellidosPartes.some(a => a.length < 3)){
            alert("Debe ingresar al menos dos apellidos de 3 letras cada uno.");
            return false;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            alert("El formato del correo electrónico no es válido.");
            return false;
        }

        if (!/^[^\s@]+@[^\s\.@]+\.[^\s\.@]+$/.test(emailconfirm)){
            alert("El formato del correo electrónico no es válido.");
            return false;
        }

        if (email !== emailconfirm) {
            alert("Los correos no coinciden.");
            return false;
        }

        if (!birthday || new Date(birthday) > new Date()){ //La fecha no puede ser posterior al día de hoy
            alert("Fecha de nacimiento no válida.");
            return false;
        }

        if(!city){
            alert("Debe ingresar una ciudad");
            return false;
        }

        if (login.length < 5){
            alert("El nombre de usuario debe tener al menos 5 carácteres.");
            return false;
        }

        const forbidden = ["tourComments", "discoverComments"];
        if (forbidden.includes(login)){
            alert("Nombre de usuario prohibido");
            return false;
        }
        
        if (!(/[A-Z]/.test(password) && /[a-z]/.test(password) && /[!@#$%^&*]/.test(password)
            && /[0-9].*[0-9]/.test(password) && password.length >= 8)){ 
            alert("La contraseña debe tener 8 caracteres, 2 números, 1 carácter especial, 1 mayúscula y 1 minúscula.");
            return false;
        }
        
        if (!foto) {
            alert("Debe subir una imagen de perfil.");
            return false;
        }

        const validFormats = ["image/webp", "image/png", "image/jpeg", "image/jpg"];

        if (!validFormats.includes(foto.type)){
            alert("Solo se permiten archivos .webp, .png, .jpeg o .jpg.");
            return false;
        }

        const fr = new FileReader();
        fr.addEventListener('load', () => {
                localStorage.setItem(login, JSON.stringify({
                    "name": nombre,
                    "surnames": apellidos,
                    "email": email,
                    "birthday": birthday,
                    "city": city,
                    "password": password,
                    "itinerary": [],
                    "image": fr.result
                }));
                window.location.href = "inicio.html?username=" + encodeURIComponent(login);
        })
        fr.readAsDataURL(foto);
    })
})