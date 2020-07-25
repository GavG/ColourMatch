window.addEventListener('load', init)

//Objects
let canvas, ctx

//FillStyles
let menuBackground

//Fonts
let h1, h2, h3

//scenes
let currentScene
let menuScene

function init()
{
    canvas = document.getElementById("gameCanvas")
    ctx = canvas.getContext("2d");

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas, false)
    
    initColors()
    initFonts()
    initScenes()

    currentScene = menuScene
    drawCurrentScene()
}

function resizeCanvas()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawCurrentScene()
}

function initColors()
{
    menuBackground = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    menuBackground.addColorStop(0, "#333")
    menuBackground.addColorStop(1, "#999")    
}

function initFonts()
{
    h1 = {
        color: "#DE4",
        typeFace: (canvas.height / 30) + "px Arial",
    }

    h2 = {
        color: "#3ED",
        typeFace: (canvas.height / 40) + "px Arial",
    }
}

function initScenes()
{
    menuScene = {
        draw: function(){
            ctx.fillStyle = menuBackground;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawText("COLOUR MATCH", h1)
        }
    }
}

function drawCurrentScene()
{
    if(currentScene) currentScene.draw()
}

//Utils
function drawText(text, font, x = canvas.width / 2, y = canvas.height / 2, alignment = 'center')
{
    ctx.font = font.typeFace
    ctx.fillStyle = font.color
    ctx.textAlign = alignment
    ctx.fillText(text, x, y)
}