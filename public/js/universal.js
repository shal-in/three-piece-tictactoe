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



// Symbols
function getSVG(symbol, color=1) {
    if (symbol === "X") {
        return `<svg class="game-svg fade-in-2000" id="X-game-svg" width="115" height="115" viewBox="0 0 117 117" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M110.83 6.43311L6.40576 110.857M6.40576 6.43311L39.9706 39.998M58.6177 58.6451L110.83 110.857" stroke="var(--X${color}-main" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
    }
    else {
        return `<svg class="game-svg" id="O-game-svg" width="115" height="115" viewBox="0 0 115 115" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M26.8563 15.6546C49.9731 -1.14072 82.3278 3.98376 99.1231 27.1006C115.918 50.2172 110.794 82.572 87.6772 99.3674C64.5606 116.163 32.2056 111.038 15.4104 87.9215C5.85709 74.7725 3.39603 58.6351 7.30358 44.0718" stroke="var(--O${color}-main" stroke-width="11" stroke-linecap="round"/>
        </svg>`
    }
}


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

