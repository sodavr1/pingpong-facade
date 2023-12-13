const canvas = document.getElementById('score');
const context = canvas.getContext('2d');

// SCORE GLOBALS VARS
const grid = 10;

// SCORE DRAWING
function drawScores() {
    context.fillStyle = 'white';
    context.font = '50px Arial';
    context.fillText('Player 1: ' + 100 // testval
    , 45, 30);
    context.fillText('Player 2: ' + rightPlayerScore, canvas.width - 100, 30);
}


 // Resize canvas when the window is resized
 window.addEventListener('resize', () => {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
 });



function Timer(func, time){
    return setTimeout(func,time)
}
