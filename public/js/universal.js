if (window.location.pathname !== "/") {
    window.addEventListener('beforeunload', function (e) {
        // Prevent the default unload behavior to show the standard dialog
        e.preventDefault();
        e.returnValue = ''; // Some browsers require returnValue to be set
    });
}

// Rules
const ruleBtnEl = document.getElementById("rules-btn");

function rulesBtnFunction() {
    createNotification("Rules functionality coming soon");
}

ruleBtnEl.addEventListener("click", rulesBtnFunction)

const leftArrowEl = document.getElementById("rules-left");
const rightArrowEl = document.getElementById("rules-right");

let i=0;
if (leftArrowEl) {
    leftArrowEl.addEventListener("click", () => {
        if (i === 0) {
            console.log(i);
            return
        }
        i -= 1;
        i = i % rulesProgress.length;
    
        updateRulesProgress(i);
    })
}
if (rightArrowEl) {
    rightArrowEl.addEventListener("click", () => {
        if (i === rulesProgress.length - 1) {
            console.log(i);
            return
        }
    
        i += 1;
        i = i % rulesProgress.length;
    
        updateRulesProgress(i);
    })
}

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
const themes = ["dark", "light"];
let themesIndex = localStorage.getItem("themesIndex");
if (!themesIndex) {
    themesIndex = 0;
    localStorage.setItem("themesIndex", themesIndex);
} else {
    themesIndex = parseInt(themesIndex, 10); // Convert the retrieved string to an integer
}

function themesBtnFunction() {
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
        createNotification("test")
    }
})

const highlightOverlayContainer = document.getElementById("highlight-overlay-container");
function createNotification(text="This is an example notification. This is a longer notification", time=2000) {
    notificationTextEl.textContent = text;

    let highlightOverlayContainerDisplay = window.getComputedStyle(highlightOverlayContainer).display;

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

// Game title home button
const gameTitleEl = document.getElementById("game-title-container");
if (gameTitleEl) {
    gameTitleEl.style.cursor = "pointer";
    gameTitleEl.addEventListener("click", () => {
        window.location.href = "/"
    })
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

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Footer buttons
const footerRightBtnEls = Array.from(document.getElementsByClassName("footer-hyperlink"));

for (let footerBtnEl of footerRightBtnEls) {
    footerBtnEl.style.border = "none";

    let hyperlink = footerBtnEl.getAttribute("link");

    footerBtnEl.addEventListener("click", () => {
        window.open(hyperlink, "_blank")
    })
}

const footerLeftBtnEls = Array.from(document.getElementsByClassName("footer-btn"));

for (let footerBtnEl of footerLeftBtnEls) {
    let hyperlink = footerBtnEl.getAttribute("link");

    footerBtnEl.addEventListener("click", () => {
        window.open(hyperlink, "_blank")
    })
}

const downArrowEl = document.getElementById("down-arrow");

window.addEventListener('scroll', function() {
    var scrollPosition = window.scrollY || window.pageYOffset;
    var windowHeight = window.innerHeight;
    var bodyHeight = document.body.clientHeight;
    
    // Check if user has scrolled to the bottom
    if (scrollPosition + windowHeight >= bodyHeight) {
        if (window.getComputedStyle(downArrowEl).display !== "none") {
            downArrowEl.classList.add("fade-out-350");
            
            setTimeout(() => {
                downArrowEl.style.display = "none";
            }, 348)
        }
    }
});
