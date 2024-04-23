console.log("index.js")

const localBtnEl = document.getElementById("local-btn");
const onlineBtnEl = document.getElementById("online-btn");
const joinBtnEl = document.getElementById("join-btn");
const joinInputEl = document.getElementById("join-input");

localBtnEl.addEventListener("click", localBtnFunction);
onlineBtnEl.addEventListener("click", onlineBtnFunction);
joinBtnEl.addEventListener("click", joinBtnFunction);
joinInputEl.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        joinBtnFunction()
    }
})

function localBtnFunction() {
    console.log("local");
}

function onlineBtnFunction() {
    console.log("online");

    // Assuming you"re using Fetch API or XMLHttpRequest
    fetch("/createGame")
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const gameCode = data.gameCode
                console.log(`/${gameCode}`)
                window.location.href = `/${gameCode}`
            }
        })
        .catch(error => {
            console.error("Error:", error);
         });
}

function joinBtnFunction() {
    console.log("join");

    let joinCode = joinInputEl.value;

    if (!isValidGameCode(joinCode)) {
        alert("Enter a valid game code")
        joinInputEl.value = ""
        return;
    }

    joinInputEl.value = ""
    console.log(joinCode);

    // Send a POST request with data to the server
    fetch("/joinGame", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            "gameCode": joinCode
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            const gameCode = data.gameCode
            console.log(`/${gameCode}`)
            // window.location.href = `/${gameCode}`
        }
        else {
            alert(data.failureReason);
        }
    })
    .catch(error => {
        // Handle any errors
        console.error("Error:", error);
    });
}

function isValidGameCode(str) {
    // Define the regular expression pattern
    const pattern = /^[a-zA-Z]+-[a-zA-Z]+$/;

    // Test the string against the pattern
    return pattern.test(str);
}