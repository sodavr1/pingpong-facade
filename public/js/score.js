let scores = [];
let prevScorePlayer1; let prevScorePlayer2;

// Fetch score data from prev game
getScoreData();
async function getScoreData() {
  const response = await fetch("http//localhost:3001/scores");
  scores = await response.json();
  prevScorePlayer1 = scores[scores.length-1].player1;
  prevScorePlayer2 = scores[scores.length-1].player2;
  // draw call after prev score fetched
  drawScores();
}

const canvas = document.getElementById('score');
const context = canvas.getContext('2d');
// SCORE DRAWING
function drawScores() {
    context.fillStyle = 'white';
    context.font = '25px Silkscreen';
    context.fillText('PREV GAME SCORE'
    , 45,30);
    context.fillText('^_^ Player 1 :'+' '+prevScorePlayer1
        , 45, 70);
    context.fillText('0_0 Player 2 :'+' '+prevScorePlayer2
    , 45,120);
    context.fillText('WINNER'
        , 45,160);
    context.fillText(prevScorePlayer2 < prevScorePlayer1 ? 'Player 1' : 'Player 2'
        , 45,180);
}

 // Resize canvas when the window is resized
 window.addEventListener('resize', () => {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
 });