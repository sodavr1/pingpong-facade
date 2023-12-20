
let liveScorePlayer1; let liveScorePlayer2;
let liveScores = [];

setInterval(function () {getScoreData();}, 1000);


async function getScoreData() {
        const response = await fetch('/livescore');
        liveScores = await response.json();
        liveScorePlayer1 = liveScores[liveScores.length-1].player1;
        liveScorePlayer2 =liveScores[liveScores.length-1].player2;
        drawScores();
        console.log(liveScores );
}

// SCORE DRAWING
function drawScores() {
    const canvas = document.getElementById('score');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.font = '25px Silkscreen';
    context.fillText('LIVE SCORE'// testval
        , 45,30);
    context.fillText('^_^ P1'+ ' '+liveScorePlayer1  
        , 45, 70);
    context.fillText('0__0 P2' +' '+liveScorePlayer2
        , 45,120);
}

getScoreData();

// Resize canvas when the window is resized
window.addEventListener('resize', () => {
    const canvas = document.getElementById('score');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

export default {getScoreData}


