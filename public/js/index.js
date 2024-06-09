console.log('index.js')

// Local
const localBtnEl = document.getElementById("local-btn");

function localBtnFunction() {
    window.location.href = "/local";
}

localBtnEl.addEventListener("click", localBtnFunction);



// Online
const onlineBtnEl = document.getElementById("online-btn");

function onlineBtnFunction() {
    console.log("online")

    fetch("/createGame")
    .then(response => {
        // Check if the response is OK (status code in the range 200-299)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Check if the response data has the expected format
        if (data.status === "game created") {
            const gameCode = data.gameCode;
            console.log(`/${gameCode}`);
            window.location.href = `/${gameCode}`;
        } else {
            throw new Error('Unexpected response format');
        }
    })
    .catch(error => {
        // Log any error that occurs during the fetch or processing
        console.error("Error:", error);
    });

}

onlineBtnEl.addEventListener("click", onlineBtnFunction);





// Join
function highlightOverlayContainerFunction() {
    highlightOverlayContainer.classList.add("fade-out-350");
    joinOverlayContainer.classList.add("fade-out-350");

    highlightOverlayContainer.classList.remove("fade-in-350");
    joinOverlayContainer.classList.remove("fade-in-350");

    setTimeout(() => {
        highlightOverlayContainer.style.display = "none";
        joinOverlayContainer.style.display = "none";

        highlightOverlayContainer.classList.remove("fade-out-350");
        joinOverlayContainer.classList.remove("fade-out-350");
    }, 320);
}

const joinOverlayContainer = document.getElementById("join-overlay-container");

const joinInputEl = document.getElementById("join-input");

joinInputEl.addEventListener("focus", () => {
    highlightOverlayContainer.removeEventListener("click", highlightOverlayContainerFunction);
});

joinInputEl.addEventListener("blur", () => {
    setTimeout(() => {highlightOverlayContainer.addEventListener("click", highlightOverlayContainerFunction)},
    500);
})

const joinBtnEl = document.getElementById("join-btn");

joinBtnEl.addEventListener("click", joinBtnFunction);

function joinBtnFunction() {
    highlightOverlayContainer.classList.add("fade-in-350");
    joinOverlayContainer.classList.add("fade-in-350");

    highlightOverlayContainer.style.display = "inline";
    joinOverlayContainer.style.display = "inline";

    joinInputEl.focus();
}

const joinInputBtnEl = document.getElementById("join-input-btn");

function joinInputBtnFunction() {
    let joinCode = joinInputEl.value.toLowerCase();

    if (!isValidGameCode(joinCode)) {
        createNotification("Invalid join code");
        joinInputEl.value = "";
        return
    }

    joinInputEl.value = ""
    console.log(joinCode);

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
        if (data.status === "join game") {
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

joinInputBtnEl.addEventListener("click", joinInputBtnFunction)

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        if (joinOverlayContainer.style.display !== "none") {
            joinInputBtnFunction()
        }
    }
})






function isValidGameCode(str) {
    // Define the regular expression pattern
    const pattern = /^[a-zA-Z]+-[a-zA-Z]+$/;

    // Test the string against the pattern
    return pattern.test(str);
}