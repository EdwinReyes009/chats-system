const WebSocket = require("ws"); //importar websockets

const http = require("http"); //importar servidor web

const server = http.createServer(); //usar servidor web

const wss = new WebSocket.Server({ server }); //pasar el servidor al websocket


//Escuhamos los diferentes eventos
wss.on("connection", function connection(ws){

    //Escuchamos los mensajes entrabtes
    ws.on("message", function incoming(data) {

        //Iteramos y encviamos a todos los clientes conectados la información recibida
        wss.clients.forEach(function each(client){

            if (client.readyState === WebSocket.OPEN) {
                //Enviamos la información recibida
                client.send(data.toString())
            }
        })  
    })
})

//Levantamos servidor HTTP 
server.listen(8080)
console.log("Servidor funcionando. Utiliza ws://localhost:8080 para conectar.")