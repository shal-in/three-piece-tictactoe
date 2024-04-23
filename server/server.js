const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "/../public/");
const port = process.env.PORT || 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.json());
app.use(express.static(publicPath));
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Define routes for different URLs
app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/online", (req, res) => {
    const io = req.io;
    res.sendFile(path.join(publicPath, "online.html"));
})

app.get("/createGame", (req, res) => {
    const gameCode = generateUniqueGameCode();
    console.log(gameCode);

    const game = {
        users: []
    }

    rooms[gameCode] = game

    const responseData = {
        "status": "success",
        "gameCode": gameCode
    };
    
    res.json(responseData);
}); 

app.post("/joinGame", (req, res) => {
    const gameCode = req.body.gameCode;

    if (!rooms[gameCode]) {
        // room does not exist
        console.log("room does not exist");

        const responseData = {
            "status": "failure",
            "failureReason": "Game lobby does not exist. Please enter an active game code, or create a new game.",
            "gameCode": gameCode
        }

        res.json(responseData);
        return;
    }

    if (rooms[gameCode].users === 2) {
        // room is full
        console.log("room is full");

        const responseData = {
            "status": "failure",
            "failureReason": "Game lobby is full. Please create a new game, and invite your friends.",
            "gameCode": gameCode
        }

        res.json(responseData);
        return;
    }

    const responseData = {
        "status": "success",
        "gameCode": gameCode
    };

    res.json(responseData);
})

app.get("/:code", (req, res) => {
    const code = req.params.code;
    
    if (rooms[code]) {
        if (rooms[code].users.length >= 2) {
            return res.redirect("/");
        }
        return res.sendFile(path.join(publicPath, "online.html"));
    }

    // If the room doesn't exist, or any other condition, redirect to the home page
    return res.redirect("/");
});



rooms = {}; userSessions = {};
io.on("connection", (socket) => {
    let sessionID = socket.id;
    // console.log(`${sessionID} just connected.`)

    socket.emit("connectionResponse", {
        "status": "success",
        "sessionID": sessionID
    })

    socket.on("gameConnect", (data) => {
        let gameCode = data.gameCode;
        let playerID;
        if (rooms[gameCode].users.length === 0) {
            playerID = "X";
        }
        else {
            playerID = "O"
        }
        
        let userData = {
            "sessionID": sessionID,
            "playerID": playerID
        }
        rooms[gameCode].users.push(userData);

        console.log(`CONNECT - ${gameCode} users: ${rooms[gameCode].users[0]}, ${rooms[gameCode].users[1]}`)

        socket.emit("gameConnectResponse", {
            "status": "success",
            "gameCode": gameCode,
            "playerID": playerID
        })
    })

    socket.on("gameReconnect", (data) => {
        let gameCode = data.gameCode;
        let oldSessionID = data.oldSessionID;

        for (let userData of rooms[gameCode].users) {
            if (userData.sessionID === oldSessionID) {
                console.log("old: " + userData.sessionID)
                userData.sessionID = sessionID;
                console.log("new: " + userData.sessionID)

                socket.emit("gameReconnectResponse", {
                    "status": "success",
                    "gameCode": gameCode,
                    "playerID": userData.playerID
                })
            }
        }
    })

    socket.on("disconnect", () => {
        // console.log(`${sessionID} disconnected.`)
    })
})

server.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on port ${port}...`);
    console.log(`Available on http://localhost:${port}`);
    console.log(`Available on http://192.168.0.44:${port}`);
    console.log();  
})








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
  