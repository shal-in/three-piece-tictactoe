let socket = io();

socket.on("connect", function() {
    console.log("Connected to server");

    socket.emit("test", {
        'data': 'example data'
    })
});

socket.on("disconnect", function() {
    console.log("Disconnected from server")
});