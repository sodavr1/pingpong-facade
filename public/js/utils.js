// reusuable utility functions

function fadeIn()
{
    // context.clearRect(0,0, canvas.width,canvas.height);
    context.globalAlpha = ga;
    var photo = new Image();
    photo .onload = function()
    {
        context.drawImage(photo , 0, 0, 450, 500);
    };
    photo .src = "photo .jpg";

    ga = ga + 0.1;

    if (ga > 1.0)
    {
        fadeOut();
        goingUp = false;
        clearInterval(timerId);
    }
}

function fadeOut()
{
    // context.clearRect(0,0, canvas.width,canvas.height);
    context.globalAlpha = ga;

    var photo = new Image();
    photo .onload = function()
    {
        context.drawImage(photo , 0, 0, 450, 500);
    };
    photo .src = "photo .jpg";

    ga = ga - 0.1;

    if (ga < 0)
    {
        goingUp = false;
        clearInterval(timerId);
    }
}

export {fadeIn, fadeOut}