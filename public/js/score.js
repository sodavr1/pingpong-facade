const canvas = document.getElementById('score');
const context = canvas.getContext('2d');

// SCORE GLOBALS VARS
const grid = 10;

// SCORE DRAWING
function drawScores() {
    context.fillStyle = 'white';
    context.font = '25px Arial';
    context.fillText('PREV GAME SCORE'// testval
    , 45,30);
    context.fillText('^_^ PLAYER 1:' + 100 // testval
    , 45, 70);
    context.fillText('^_^ PLAYER 2:' + 100 // testval
    , 45,120);
}

drawScores();

 // Resize canvas when the window is resized
 window.addEventListener('resize', () => {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
 });



function Timer(func, time){
    return setTimeout(func,time)
}
