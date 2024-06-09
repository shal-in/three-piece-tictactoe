const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const { userInfo } = require("os");
const { use } = require("express/lib/router");

const publicPath = path.join(__dirname, "/../public/");
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
const rooms = {}

app.use(express.json());
app.use(express.static(publicPath));
app.use((req, res, next) => {
    req.io = io;
    next();
});

// GET and POST requests
app.get("/createGame", (req, res) => {
    const gameCode = generateUniqueGameCode();

    const game = {
        "gameArray": ["", "", "", "", "", "", "", "", ""],
        "moves": []
    }

    const room = {
        "users": [],
        "gameCode": gameCode,
        "game": game
    }

    rooms[gameCode] = room

    const responseData = {
        "status": "game created",
        "gameCode": gameCode
    }

    res.json(responseData);
})


app.post("/joinGame", (req, res) => {
    const gameCode = req.body.gameCode;

    if (!rooms[gameCode]) {
        // room does not exist
        const responseData = {
            "status": "failure",
            "failureReason": "Game lobby does not exist. Please enter an active game code, or create a new game."
        }

        res.json(responseData);
        return;
    }

    if (rooms[gameCode].users.length >= 2) {
        // room is full
        const responseData = {
            "status": "failure",
            "failureReason": "Game lobby is full. Please create a new game, and invite your friends."
        }

        res.json(responseData);
        return;
    }

    const responseData = {
        "status": "join game",
        "gameCode": gameCode
    };

    res.json(responseData);
})


// SocketIO events
io.on("connection", (socket) => {
    let sessionID = socket.id;

    socket.emit("connectionResponse", {
        "status": "server connect",
        "sessionID": sessionID
    })

    socket.on("gameConnect", (data) => {
        let gameCode = data.gameCode;

        if (!rooms[gameCode]) {
            return
        }

        if (rooms[gameCode].users.length === 2) {
            socket.emit("gameConnectResponse", {
                "status": "failure",
                "failureReason": "Game lobby full. Please create a new game."
            })
            return
        }

        let playerID;
        if (rooms[gameCode].users.length === 0) {
            playerID = "X";
        }
        if (rooms[gameCode].users.length === 1) {
            playerID = "O";
        }

        let userData = {
            "sessionID": sessionID,
            "playerID": playerID
        }

        rooms[gameCode].users.push(userData);

        socket.emit("gameConnectResponse", {
            "status": "game connect",
            "userData": userData,
            "game": rooms[gameCode].game
        })
    }) 

    socket.on("gameReconnect", (data) => {
        let gameCode = data.gameCode;
        let oldSessionID = data.oldSessionID;

        if (!rooms[gameCode]) {
            return
        }
 
        for (let userData of rooms[gameCode].users) {
            if (userData.sessionID === oldSessionID) {
                userData.sessionID = sessionID

                socket.emit("gameConnectResponse", {
                    "status": "game reconnect",
                    "userData": userData,
                    "game": rooms[gameCode].game
                })
            }
        }
    })

    socket.on("playMove", (data) => {
        let move = data.move;
        gameCode = data.gameCode;

        if (!rooms[gameCode]) {
            return
        }

        rooms[gameCode].game.gameArray[move.id] = move.symbol;
        rooms[gameCode].game.moves.push(move);

        if (rooms[gameCode].game.moves.length > 6) {
            let removeMove = rooms[gameCode].game.moves[rooms[gameCode].game.moves.length - 7];

            rooms[gameCode].game.gameArray[removeMove.id] = "";
        }

        for (userData of rooms[gameCode].users) {
            if (userData.sessionID) {
                io.to(userData.sessionID).emit("playMoveResponse", {
                    "status": "success",
                    "game": rooms[gameCode].game
                })
            }
        }
    })
})

// URL paths
app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/local", (req, res) => {
    res.sendFile(path.join(publicPath, "local.html"));
});

app.get("/:code", (req, res) => {
    const code = req.params.code;
    
    if (rooms[code]) {
        return res.sendFile(path.join(publicPath, "online.html"));
    }

    // If the room doesn"t exist, or any other condition, redirect to the home page
    return res.redirect("/");
});











const port = process.env.PORT || 8081;
server.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on port ${port}...`);
    console.log(`Available on http://localhost:${port}`);
    console.log(`Available on http://192.168.0.218:${port}`);
    console.log();  
})











// Generate game code
function generateGameCode() {
    const adjectives = {
        "a": ["angry", "agile", "alert", "adorable", "awkward", "artistic", "affectionate", "amazing", "annoying"],
        "b": ["beautiful", "beloved", "blissful", "balanced", "brave", "bright", "best", "boring", "bubbly", "blue", "black"],
        "c": ["calm", "casual", "cheerful", "colourful", "capable", "clever", "comical", "caring", "classic", "clean", "classy"],
        "d": ["delightful", "dashing", "decent", "dreamy", "dandy", "dynamic", "dapper", "deluxe", "divine", "dominant"],
        "e": ["eager", "earnest", "elated", "electric", "elegant", "eloquent", "epic", "enchanting", "ethereal", "excellent", "exotic"],
        "f": ["fabulous", "fearless", "forgiving", "fancy", "fantastic", "festive", "fierce", "fluffy", "favourite"], 
        "g": ["glossy", "grateful", "glowing", "gigantic", "green", "gentle", "genuine"]
    }
    
    const nouns = {
        "a": ["apple", "apricot", "airplane", "asparagus", "apartment", "arrow", "ambulance", "angel"],
        "b": ["baby", "bear", "ball", "book", "bridge", "bird", "bee", "bat", "bacteria", "bread"],
        "c": ["cat", "cabbage", "computer", "cannon", "cow", "crow", "caramel", "crab", "cake", "cable"],
        "d": ["dog", "dancer", "deer", "date", "dragon", "diamond", "dice", "dad", "doll", "duck", "daughter"],
        "e": ["egg", "engine", "elephant", "elk", "eel", "eagle", "earth"],
        "f": ["food", "fan", "fairy", "fabric", "family", "father", "field", "fish", "flock", "food", "friend"], 
        "g": ["goat", "girl", "garlic", "grape", "gift", "guest", "garbage", "guitar", "gulf"]
    }
    
    const letters = ["a", "b", "c", "d", "e", "f", "g"]

    const letter = letters[getRandomInt(0, letters.length - 1)];
    const adjective = adjectives[letter][getRandomInt(0, adjectives[letter].length - 1)];
    const noun = nouns[letter][getRandomInt(0, nouns[letter].length - 1)];

    const string = `${adjective}-${noun}`;

    return string
}

function generateUniqueGameCode() {
    let gameCode;
    do {
        gameCode = generateGameCode();
    } while (rooms[gameCode]); // Continue generating until a unique game code is found
    return gameCode;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}