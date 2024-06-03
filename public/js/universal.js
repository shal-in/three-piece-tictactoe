console.log("universal.js");

// Rules
const ruleBtnEl = document.getElementById("rules-btn");

function rulesBtnFunction() {
    createNotification("Rules functionality coming soon");
}

ruleBtnEl.addEventListener("click", rulesBtnFunction)

const leftArrowEl = document.getElementById("rules-left");
const rightArrowEl = document.getElementById("rules-right");

let i=0;
leftArrowEl.addEventListener("click", () => {
    if (i === 0) {
        console.log(i);
        return
    }
    i -= 1;
    i = i % rulesProgress.length;

    updateRulesProgress(i);
})
rightArrowEl.addEventListener("click", () => {
    if (i === rulesProgress.length - 1) {
        console.log(i);
        return
    }

    i += 1;
    i = i % rulesProgress.length;

    updateRulesProgress(i);
})

const rulesProgress = Array.from(document.getElementsByClassName("rules-progress-dot"));
function updateRulesProgress(i) {
    for (let k=0; k < rulesProgress.length; k++) {
        if (k === i) {
            rulesProgress[k].style.backgroundColor = `var(--secondary-main)`
        }
        else {
            rulesProgress[k].style.backgroundColor = `var(--primary-main)`
        }
    }

    if (i === rulesProgress.length - 1) {
        rightArrowEl.style.opacity = "0";
    }
    else {
        rightArrowEl.style.opacity = "1";
    }

    if (i === 0) {
        leftArrowEl.style.opacity = "0";
    }
    else {
        leftArrowEl.style.opacity = "1";
    }
}

// Themes
const themeBtnEl = document.getElementById("theme-btn");
const themes = ["dark", "main"];
let themesIndex = localStorage.getItem("themesIndex");
if (!themesIndex) {
    themesIndex = 0;
    localStorage.setItem("themesIndex", themesIndex);
} else {
    themesIndex = parseInt(themesIndex, 10); // Convert the retrieved string to an integer
}

function themesBtnFunction() {
    console.log("themes");

    themesIndex += 1
    if (themesIndex == themes.length) {
        themesIndex = 0;
    }

    const root = document.documentElement;

    root.style.setProperty(`--background-main`, `var(--background-${themes[themesIndex]})`);
    root.style.setProperty(`--primary-main`, `var(--primary-${themes[themesIndex]})`);
    root.style.setProperty(`--secondary-main`, `var(--secondary-${themes[themesIndex]})`);
    root.style.setProperty(`--overlay-background-main`, `var(--overlay-background-${themes[themesIndex]})`);
    root.style.setProperty(`--X1-main`, `var(--X1-${themes[themesIndex]})`);
    root.style.setProperty(`--X2-main`, `var(--X2-${themes[themesIndex]})`);
    root.style.setProperty(`--O1-main`, `var(--O1-${themes[themesIndex]})`);
    root.style.setProperty(`--O2-main`, `var(--O2-${themes[themesIndex]})`);

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

function createNotification(text="This is an example notification. This is a longer notification", time=2000) {
    notificationTextEl.textContent = text;

    let highlightOverlayContainerDisplay = highlightOverlayContainer.style.display;

    notificationContainerEl.classList.remove("fade-out-350");
    notificationContainerEl.classList.add("fade-in-350");
    notificationContainerEl.style.display = "flex";

    highlightOverlayContainer.classList.remove("fade-out-350");
    highlightOverlayContainer.classList.add("fade-in-350");
    highlightOverlayContainer.style.display = "flex";

    setTimeout(() =>{
        notificationContainerEl.classList.remove("fade-in-350");
        highlightOverlayContainer.classList.remove("fade-in-350");
        
        notificationContainerEl.classList.add("fade-out-350");

        if (highlightOverlayContainerDisplay === "none") {
            highlightOverlayContainer.classList.add("fade-out-350");
        }
        setTimeout(() => {
            notificationContainerEl.style.display = "none";

            if (highlightOverlayContainerDisplay === "none") {
                highlightOverlayContainer.style.display = "none";
            }
        }, 300)
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
