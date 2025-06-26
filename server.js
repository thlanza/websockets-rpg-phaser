const http = require('http');
const app = require('express')();
const express = require("express");
const uuid = require('uuid').v4

app.use("/js", express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

const CLIENT_PORT = process.env.CLIENT_PORT || 5500;
app.listen(CLIENT_PORT, () => console.log(`Client Port, escutando na porta ${CLIENT_PORT}`));

const websocketServer = require("websocket").server;
const httpServer = http.createServer();

const SERVER_PORT = process.env.SERVER_PORT || 9090;
httpServer.listen(SERVER_PORT, () => console.log(`Server Port, escutando na porta ${SERVER_PORT}`));

console.log("uuid", uuid());

let players = [];
let playerInfo = {};

const wsServer = new websocketServer({
    "httpServer": httpServer
})

wsServer.on("request", request => {
    const connection = request.accept(null, request.origin);

    connection.on("close", () => {
        players.forEach(player => {
            if (player.playerId !== playerId) {
                const payload = {
                    "method": "disconnect",
                    "playerId": playerId
                }
                player.connection.send(JSON.stringify(payload));
            }
        })
        players = players.filter(player => player.playerId !== playerId);
    });

    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data);

        if (result.method === "currentPlayers") {
            players.forEach(player => {
                if (player.playerId !== playerId) {
                    const payload = {
                        "method": "currentPlayers",
                        "playerId": player.playerId,
                        "x": player.x,
                        "y": player.y
                    }
                    connection.send(JSON.stringify(payload));
                }
            })
        }
    })

    const playerId = randomPlayerId();
    const x = randomX();
    const y = randomY();

    playerInfo = {
        "connection": connection,
        "playerId": playerId,
        "x": x,
        "y": y
    }

    const payload = {
        "method": "connect",
        "playerId": playerId,
        "x": x,
        "y": y
    };

    connection.send(JSON.stringify(payload));

    players.forEach(player => {
        const payload = {
            "method": "newPlayer",
            "playerId": playerId,
            "x": x,
            "y": y
        };
        player.connection.send(JSON.stringify(payload));
    })

    players.push(playerInfo);
});

function randomPlayerId() {
    return uuid();
}

function randomX() {
    return Math.floor(Math.random() * 700) + 35;
}

function randomY() {
    return Math.floor(Math.random() * 300) + 50;
}


