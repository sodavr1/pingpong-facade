const waitTable = document.getElementById('gameQueue');
//init wait time
let waitTime = 1;
let queueTimer = 0;

function convert(seconds) {
    let minutes = Math.floor(seconds / 60)
    return minutes;
}

function waitTimings() {
    queueTimer++;
    console.log(convert(queueTimer), convert(queueTimer));
    for (let i = 0, row; row = waitTable.rows[i]; i++) {
        console.log(row);
        // if global timer === 0 rows.cells[3] WAIT TIME
        if (convert(queueTimer) === convert(row.cells[3])) {
            console.log(queueTimer, Math.floor(row.cells[3] / 60));
            removeRow(row[i].id);

        }
        console.log(row.cells[3]);
    }
}

// Queue timers
// check wait queue every second
setInterval(function () { waitTimings() }, 1000);

// START BUTTON AND LISTENERS
document.getElementById('joinGame').addEventListener('click', function () {
    if (waitTable.rows.length < 6) {
        waitTime = waitTime + 1;
        addGame(waitTime)
    }
    else {
        alert('Max Queue reached, please return later')
    }
});

const player1Name = document.querySelector('#player1');
player1Name.addEventListener("change", (event) => {
    player1Name.textContent = event.target.value;
});
const player2Name = document.querySelector('#player2');
player2Name.addEventListener("change", (event) => {
    player2Name.textContent = event.target.value;
});

function addGame(waitTime) {
    console.log(queueTimer);
    let waitID = crypto.randomUUID();
    const player1Name = document.querySelector('#player1').value;
    const player2Name = document.querySelector('#player2').value;
    const newRow = document.createElement('tr');
    newRow.setAttribute('id', waitID);
    const newHeadingID = document.createElement('td');
    const newHeadingp1Name = document.createElement('td');
    const newHeadingp2Name = document.createElement('td');
    const newHeadingWaitTime = document.createElement('td');

    const idText = document.createTextNode(waitID);
    const p1Text = document.createTextNode(player1Name);
    const p2Text = document.createTextNode(player2Name);
    const waitText = document.createTextNode(waitTime);

    newHeadingID.appendChild(idText);
    newHeadingp1Name.appendChild(p1Text);
    newHeadingp2Name.appendChild(p2Text);
    newHeadingWaitTime.appendChild(waitText);

    newRow.appendChild(newHeadingID);
    newRow.appendChild(newHeadingp1Name);
    newRow.appendChild(newHeadingp2Name);
    newRow.appendChild(newHeadingWaitTime);
    waitTable.appendChild(newRow);
    waitTimings();
}

function beginNewGame() {
    //foward next queued game to screen E
    window.open("/screenE.html", "newGame" + waitID);
}

function removeRow(rowID) {
    console.log('remove called');
    var row = document.getElementById(rowID);
    row.parentNode.removeChild(row);
}

// Add touch event listeners to the canvas
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);

// Handle touch start event
function handleTouchStart(event) {
    event.preventDefault();

    // Iterate through all touches
    for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
    }
}

// Handle touch move event
function handleTouchMove(event) {
    event.preventDefault();

    // Iterate through all touches
    for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];

    }
}

// Add touchend event listeners to reset touch positions when touches end
document.addEventListener('touchend', handleTouchEnd);

// Handle touch end event
function handleTouchEnd(event) {
    event.preventDefault();

    // Iterate through all touches
    for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
    }
}

// timer with params
function Timer(func, time) {
    return setTimeout(func, time)
}

function countdownTimer(seconds, callback) {
    let remainingTime = seconds;
    function updateTimer() {
        if (remainingTime > 0) {
            console.log(`${remainingTime} seconds remaining`);
            remainingTime--;
            setTimeout(updateTimer, 1000); // Update every 1 second (1000 milliseconds)
        } else {
            if (callback && typeof callback === "function") {
                callback(); // Execute the callback function when the timer reaches zero
            }
        }
    }
    updateTimer(); // Start the countdown
}

