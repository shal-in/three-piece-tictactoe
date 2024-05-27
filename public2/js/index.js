console.log("index.js")

const localBtnEl = document.getElementById("local-btn");
const onlineBtnEl = document.getElementById("online-btn");
const joinBtnEl = document.getElementById("join-btn");
const joinPopupBtnEl = document.getElementById("join-popup-btn");
const joinPopupInputEl = document.getElementById("join-popup-input");

const overlayEl = document.getElementById("overlay-container");
const joinPopupContainerEl = document.getElementById("join-popup-container");
const joinPopupQuitBtnEl = document.getElementById("join-popup-quit-button");

localBtnEl.addEventListener("click", localBtnFunction);
onlineBtnEl.addEventListener("click", onlineBtnFunction);
joinBtnEl.addEventListener("click", joinBtnFunction);
joinPopupBtnEl.addEventListener("click", joinPopupBtnFunction);
joinPopupInputEl.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        joinPopupBtnFunction()
    }
})
joinPopupQuitBtnEl.addEventListener("click", joinPopupQuitBtnFunction)

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
    console.log("join")

    overlayEl.style.display = "flex";
    joinPopupContainerEl.style.display = "flex";
}

function joinPopupQuitBtnFunction() {
    console.log("quit");

    overlayEl.style.display = "none";
    joinPopupContainerEl.style.display = "none";
}

function joinPopupBtnFunction() {
    console.log("join");

    let joinCode = joinPopupInputEl.value;
    joinCode = joinCode.toLowerCase();

    if (!isValidGameCode(joinCode)) {
        createNotification("Enter a valid game code")
        joinPopupInputEl.value = ""
        return;
    }

    joinPopupInputEl.value = ""
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
            const gameCode = data.gameCode;
            window.location.href = `/${gameCode}`
        }
        else {
            createNotification(data.failureReason);
        }
    })
    .catch(error => {
        // Handle any errors
        console.error("Error:", error);
    });
}

const notificationContainerEl = document.getElementById("notification-container");
const notificationTextEl = document.getElementById("notification-text");
function createNotification(message="TEST", duration=2000) {
    notificationTextEl.textContent = message;
    overlayEl.style.display = "flex";
    notificationContainerEl.style.display = "flex";

    setTimeout(() => {
        notificationContainerEl.style.display = "none";
        
        if (joinPopupContainerEl.style.display === "none") {
            overlayEl.style.display = "none";   
        }
    }, duration);
}

function isValidGameCode(str) {
    // Define the regular expression pattern
    const pattern = /^[a-zA-Z]+-[a-zA-Z]+$/;

    // Test the string against the pattern
    return pattern.test(str);
}