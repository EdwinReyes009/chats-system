const protocol = "ws";
const host = "localhost";
const port = "8080";
const url = `${protocol}://${host}:${port}`;
const wss = new WebSocket(url);
const wrapperNot = document.querySelector("#notificaciones");
const usuario = document.querySelector("#usuario");
const mensaje = document.querySelector("#mensaje");
const mensajes = document.querySelector("#mensajes");

//Valida si el nombre de usuario es correcto

function validarUsuario(evento) {
    if (usuario.value == "") {
        usuario.classList.remove("is-valid");
        usuario.classList.add("is-invalid");
        wrapperNot.innerHTML = '<div class="alert alert-danger">Escribe tu nombre de usuario para chatear.</div>';

        //Bloquear el input
        mensaje.setAttribute("disabled", true)
    }
    else{
        usuario.classList.remove("is-invalid");
        usuario.classList.add("is-valid");

        //Activar el input
        mensaje.removeAttribute("disabled");

        //Limpia notificaciones en caso de existir
        wrapperNot.innerHTML = ""; 
    }
    
}

//Evento para validar el nombre de usuario
usuario.addEventListener("keyup", validarUsuario)

//Esto se ejecuta cuando se abre una conexion con exito de websocket

function open() {
    console.log("Websocket abierto");
}


function message(evento) {

    //Se recibe un mensaje
    console.log("WebSocket ha recibido un mensaje");

    //Payload del mensaje
    let data = JSON.parse(evento.data);

    //Mostrar mensaje en HTML
    if (data.usuario == usuario.value) {
        mensajes.innerHTML += 
        /*HTML*/
       ` <div class = "row">
            <div class = "col-12 offset-md-4 col-md-8 bg-light shadow rounded d-block px-3 py-2 mb-2 text-dark">
                <span class="fw-bold d-block">Tú:</span>
                ${data.mensaje}
                <small class="d-block text-muted">${new Date(data.fecha).toLocaleDateString("es-MX")}</small>
                <small class="d-block text-muted">${new Date(data.fecha).toLocaleTimeString("es-MX")}</small>
            </div>
        </div>`
    }else{
        mensajes.innerHTML += 
        ` <div class = "row">
            <div class = "col-12 col-md-8 bg-primary shadow rounded d-block px-3 py-2 mb-2 text-white">
                <span class="fw-bold d-block">${data.usuario} dijo:</span>
                ${data.mensaje}
                <small class="d-block text-white">${new Date(data.fecha).toLocaleDateString("es-MX")}</small>
                <small class="d-block text-white">${new Date(data.fecha).toLocaleTimeString("es-MX")}</small>
                
               
            </div>
        </div>`
    }
}

function error(evento) {
    console.error("WebSocket ha observado un error: ", evento);
}

function close() {
    console.log("Websocket cerrado");
}

function enviarMensaje(evento) {
    //Evento tecla Enter
    if (evento.code === "Enter") {
        if (mensaje.value == "") {
            wrapperNot.innerHTML = '<div class="alert alert-danger">Escribe un mensaje válido para enviar.</div>';
            return;
        }

        wrapperNot.innerHTML = "";

        const date = new Date();
        const horario = date.getHours + ":" + date.getMinutes + ":" + date.getSeconds;

        let payload = {
            usuario: usuario.value,
            mensaje: mensaje.value,
            fecha: new Date(),
            horario: horario
           
        };

        //Envia mensaje al webSocket
        wss.send(JSON.stringify(payload));
        
        //Reiniciar nuestro input
        mensaje.value = "";
    }
}

//Evento para envia nuevo mensaje
mensaje.addEventListener("keypress", enviarMensaje);

wss.addEventListener("open", open);
wss.addEventListener("message", message);
wss.addEventListener("error", error);
wss.addEventListener("close", close)