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








randomizeHighlightCols();

function randomizeHighlightCols() {
    let colors = ["#42FF00", "#5222D9", "#D74848", "#FF0099", "#FF7A00"];

    for (let i=0; i<=8; i++) {
        let randomColor = colors[getRandomInt(0, colors.length - 1)];
        document.documentElement.style.setProperty(`--highlight-col-${i}`, randomColor);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
