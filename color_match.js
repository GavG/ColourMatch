window.addEventListener('load', init)

//Objects
let canvas, ctx

//FillStyles
let menuBackground

//Fonts
let h1, h2, h3

//scenes
let currentScene, menuScene

function init()
{
    canvas = document.getElementById("gameCanvas")
    ctx = canvas.getContext("2d");

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas, false)
    
    initColors()
    initScenes()

    setNewScene(menuScene)
}

function resizeCanvas()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initFonts()
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
        },
        listeners: [
            {
                target: window,
                type: 'keydown',
                function: (e) => console.log('keydown', e),
            }
        ]
    }
}

function setNewScene(newScene, clearSceneListeners = true)
{
    if(currentScene && clearSceneListeners)
    {
        for (let l = 0; l < currentScene.listeners.length; l++) {
            currentScene.listeners[l].target.removeEventListener(
                currentScene.listeners[l].type,
                currentScene.listeners[l].function
            )
        }
    }

    currentScene = newScene
    for (let l = 0; l < currentScene.listeners.length; l++) {
        currentScene.listeners[l].target.addEventListener(
            currentScene.listeners[l].type,
            currentScene.listeners[l].function
        )
    }

    drawCurrentScene()
}

function drawCurrentScene()
{
    if(currentScene){
        currentScene.draw()
    }
}

//Utils
function drawText(text, font, x = canvas.width / 2, y = canvas.height / 2, alignment = 'center')
{
    ctx.font = font.typeFace
    ctx.fillStyle = font.color
    ctx.textAlign = alignment
    ctx.fillText(text, x, y)
}