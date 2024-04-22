const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "/../public/");
const port = process.env.PORT || 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

// Middleware to pass socket object to the route handler
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Define routes for different URLs
app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/online", (req, res) => {
    // Access the socket object from req and use it as needed
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

    // This is the data you want to send back to the client
    const responseData = {
        "status": "success",
        "gameCode": gameCode
    };
    
    // Send the data as JSON
    res.json(responseData);
}); 

app.get("/:code", (req, res) => {
    const code = req.params.code; // Extract the code from the request parameters
    
    if (rooms[code]) {
        res.sendFile(path.join(publicPath, "online.html"));
    }

    else {
        res.redirect("/");
    }
});


rooms = {}; userSessions = {};
io.on("connection", (socket) => {
    let sessionID = socket.id;
    console.log(`${sessionID} just connected.`)

    socket.emit("connectionResponse", {
        "status": "successful",
        "sessionID": sessionID
    })

    socket.on("gameConnect", (data) => {
        let gameCode = data.gameCode;
        rooms[gameCode].users.push(sessionID);

        console.log(`${gameCode}: ${rooms[gameCode].users}`)

        socket.emit("connectResponse", {
            'status': 'successful'
        })
    })

    socket.on("gameReconnect", (data) => {
        let gameCode = data.gameCode;
        let oldSessionID = data.oldSessionID;

        console.log("old: " + rooms[gameCode].users);

        rooms[gameCode].users = rooms[gameCode].users.map(item => item === oldSessionID ? sessionID : item);

        console.log("new: " + rooms[gameCode].users);
    })

    socket.on("disconnect", () => {
        console.log(`${sessionID} disconnected.`)
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
  