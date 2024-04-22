console.log("index.js")

const localBtnEl = document.getElementById("local-btn");
const onlineBtnEl = document.getElementById("online-btn");
const joinBtnEl = document.getElementById("join-btn");
const joinInputEl = document.getElementById("join-input");

localBtnEl.addEventListener("click", localBtnFunction);
onlineBtnEl.addEventListener("click", onlineBtnFunction);
joinBtnEl.addEventListener("click", joinBtnFunction);

function localBtnFunction() {
    console.log("local");
}

function onlineBtnFunction() {
    console.log("online");

    // Assuming you're using Fetch API or XMLHttpRequest
    fetch('/createGame')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const gameCode = data.gameCode
                console.log(`/${gameCode}`)
                window.location.href = `/${gameCode}`
            }
        })
        .catch(error => {
            console.error('Error:', error);
         });
}

function joinBtnFunction() {
    console.log("join");

    let joinCode = joinInputEl.value;
    joinInputEl.value = ''
    console.log(joinCode);
}