const myFont = new FontFace('myFont', 'url(https://fonts.googleapis.com/css2?family=Silkscreen&display=swap)');

myFont.load().then(function(font){
    // with canvas, if this is ommited won't work
    document.fonts.add(font);
    console.log('Font loaded');
});

let scoreData;
//get updated score

getScoreData();

async function getScoreData() {
        const response = await fetch('/livescore');
        const liveScores = await response.json();
        console.log(liveScores );
}

scoreData = getScoreData()

const canvas = document.getElementById('score');
const context = canvas.getContext('2d');

// SCORE DRAWING
function drawScores() {
    context.fillStyle = 'white';
    context.font = '25px Silkscreen';
    context.fillText('LIVE SCORE'// testval
        , 45,30);
    context.fillText('^_^ P1 10'  // testval
        , 45, 70);
    context.fillText('0__0 P2 0'// testval
        , 45,120);
}

drawScores();

// Resize canvas when the window is resized
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});



