console.log("universal.js");

// Rules
const ruleBtnEl = document.getElementById("rules-btn");

function rulesBtnFunction() {
    console.log("rules");
}

ruleBtnEl.addEventListener("click", rulesBtnFunction)



// Themes
const themeBtnEl = document.getElementById("theme-btn");

function themesBtnFunction() {
    console.log("themes");
}

themeBtnEl.addEventListener("click", themesBtnFunction)



// Notification
const notificationContainerEl = document.getElementById("notification-container");
const notificationTextEl = document.getElementById("notification-text");

document.addEventListener("keydown", (event) => {
    if (event.key === "1") {
        createNotification()
    }
})

function createNotification(text="This is an example notification", time=2000) {
    notificationTextEl.textContent = text;
    notificationContainerEl.style.display = "flex";
    highlightOverlayContainer.style.display = "flex";

    setTimeout(() =>{
        notificationContainerEl.style.display = "none";
        highlightOverlayContainer.style.display = "none";
    }, time) 
}

// Randomize colors
randomizeHighlightCols();

function randomizeHighlightCols() {
    // [green, pink, purple, orange, blue, yellow]
    let colors = ["#89fc00", "#ff006e", "#9016d2", "#ff5714", "#00bbf9", "#fbff12"];

    for (let i=0; i<=8; i++) {
        let randomColor = colors[getRandomInt(0, colors.length - 1)];
        document.documentElement.style.setProperty(`--highlight-col-${i}`, randomColor);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
