const http = require('http');
const app = require('express')();
const express = require("express");

app.use("/js", express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

const CLIENT_PORT = process.env.CLIENT_PORT || 5500;
app.listen(CLIENT_PORT, () => console.log(`Client Port, escutando na porta ${CLIENT_PORT}`));

const websocketServer = require("websocket").server;
const httpServer = http.createServer();

const SERVER_PORT = process.env.SERVER_PORT || 9090;
httpServer.listen(SERVER_PORT, () => console.log(`Server Port, escutando na porta ${SERVER_PORT}`));

let players = [];

const wsServer = new websocketServer({
    "httpServer": httpServer
})

wsServer.on("request", request => {
    const connection = request.accept(null, request.origin);

    connection.on("close", () => console.log("Uma conexão fechou."))
})

