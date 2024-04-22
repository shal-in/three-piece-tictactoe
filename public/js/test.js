// Select all elements with class 'gameboard-grid' and convert them into an array
const gameboardGrids = Array.from(document.querySelectorAll('.gameboard-grid'));
gameboardGrids.forEach(grid => grid.addEventListener("click", gridFunction));

let gameArr = ['', '', '', '', '', '', '', '', ''];
let currentTurn = 'X'; let winner;
let moves = []; let move; let removeMove; let warningMove;

function gridFunction(event) {
    const el = event.target;
    const id = el.id.split('-').pop()

    if (el.textContent) {
        console.log('no moves');
        return;
    }

    gameArr[id] = currentTurn;
    move = [currentTurn, id];
    moves.push(move); 

    const svgMarkup = getSVG(currentTurn, 'primary');
    el.innerHTML = svgMarkup;

    setupGrid();
    currentTurn = changeTurn()
}


function changeTurn() {
    if (currentTurn === 'X') {
        return 'O';
    } else {
        return 'X';
    }
}

function setupGrid() {
    if (moves.length >= 6) {
        if (moves.length > 6) {
            removeMove = moves[0]; // [currentTurn, id];
            gameArr[removeMove[1]] = '';
            moves.shift();

            gameboardGrids[removeMove[1]].textContent = '';
            gameboardGrids[removeMove[1]].style.color = 'var(--BG-col-main)';
        }

        warningMove = moves[0]; // [currentTurn, id];
        console.log(warningMove);
        gameboardGrids[warningMove[1]].innerHTML = '';
        
        const svgMarkup = getSVG(warningMove[0], 'secondary');
        gameboardGrids[warningMove[1]].innerHTML = svgMarkup
    }

    winner = checkWinner(gameArr);
    if (winner) {
        for (id of winner[1]) {
            gameboardGrids[id].style.backgroundColor = 'green';
        }

        gameboardGrids.forEach(grid => grid.removeEventListener("click", gridFunction))

        console.log(`${winner[0]} wins!!`)

        if (warningMove) {
            gameboardGrids[warningMove[1]].innerHTML = '';
        
            const svgMarkup = getSVG(warningMove[0], 'primary');
            gameboardGrids[warningMove[1]].innerHTML = svgMarkup;
        }
        return;
    }

    console.log();
}

function checkWinner(board) {
    // Define all possible winning combinations
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    // Iterate through each winning combination
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        // Check if the elements at the indexes in the combination are equal and not empty
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            // If they are equal, we have a winner
            return [board[a], combination]; // Return the winning symbol ('X' or 'O')
        }
    }

    // If no winner is found after checking all combinations, return null
    return null;
}

function getSVG(symbol, num) {
    if (num === 'primary') {
        num = 1
    }
    else {
        num = 2
    }

    if (symbol === 'X') {
        // Return X SVG
        return `<svg class="move-svg X-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 5L5 19M5 5L9.5 9.5M12 12L19 19" stroke="var(--${symbol}-col-${num}-main)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
    }

    else {
        // Return O SVG
        return `<svg class="move-svg O-svg"viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.8273 3 17.35 4.30367 19 6.34267" stroke="var(--${symbol}-col-${num}-main" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`
    }
}





themesIndex = 0; 
themes = ['dark', 'light']

const themesBtnEl = document.getElementById("themes-btn");
themesBtnEl.addEventListener("click", themesBtnFunction);

// Get the computed value of CSS custom properties
const rootStyles = getComputedStyle(document.documentElement);
const colourEls = [
    'BG-col', 'X-col-1', 'X-col-2', 'O-col-1', 'O-col-2'
]

function themesBtnFunction() {
    themesIndex += 1
    if (themesIndex === themes.length) {
        themesIndex = 0;
    }

    for (let colourEl of colourEls) {
        document.documentElement.style.setProperty(`--${colourEl}-main`, `var(--${colourEl}-${themes[themesIndex]})`);
    }
}