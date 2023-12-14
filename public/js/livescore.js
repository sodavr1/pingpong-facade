
let scoreArr;
//get updated score

getScoreData();

async function getScoreData() {
    fetch("http://localhost:3000/livescore", {
        method: "GET",
        body: JSON.stringify({
            id, // MAKE THIS A  UUID LATER
            player1,
            player2,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
}

const canvas = document.getElementById('score');
const context = canvas.getContext('2d');

// SCORE DRAWING
function drawScores() {
    context.fillStyle = 'white';
    context.font = '25px Arial';
    context.fillText('LIVE SCORE'// testval
        , 45,30);
    context.fillText('^_^ PLAYER 1:'  // testval
        , 45, 70);
    context.fillText('0__0 PLAYER 2:'// testval
        , 45,120);
}

drawScores();

// Resize canvas when the window is resized
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});



