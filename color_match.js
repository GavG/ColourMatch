window.addEventListener('load', init)

//Objects
let canvas, ctx

//FillStyles
let menuBackground

//Fonts
let h1, h2, h3

//scenes
let currentScene, scenes

function init()
{
    canvas = document.getElementById("gameCanvas")
    ctx = canvas.getContext("2d");

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas, false)
    
    initColors()
    initScenes()

    setNewScene(scenes.menuScene)
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
    scenes = {

        menuScene: {
            draw: function()
            {
                ctx.fillStyle = menuBackground;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawText("COLOUR MATCH", h1)
            },
            listeners: [
                {
                    target: window,
                    type: 'keydown',
                    function: (e) => setNewScene(scenes.level1),
                }
            ]
        },

        level1: {
            vars:{
                colorGridRows: 2,
                colorGridCols: 2,
            },
            init: function()
            {
                currentScene.vars.colorGrid = [
                    '#FFF', '#DDD',
                    '#BBB', '#999',
                ]
            },
            draw: function()
            {
                drawColorGrid()
            },
            listeners: [
                {
                    target: window,
                    type: 'click',
                    function: function(e){
                        console.log(getCursorPosition(e))
                    },
                }
            ]
        },

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

    if(currentScene.hasOwnProperty('init')) currentScene.init()
    
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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

function drawColorGrid()
{
    let rectWidth = canvas.width / currentScene.vars.colorGridCols
    let rectHeight = canvas.height / currentScene.vars.colorGridRows

    for (let row = 0; row < currentScene.vars.colorGridRows; row++) {
        for (let col = 0; col < currentScene.vars.colorGridCols; col++) {
            ctx.fillStyle = currentScene.vars.colorGrid[row + col]
            ctx.fillRect(row * rectWidth, col * rectHeight, rectWidth, rectHeight);
        }
    }
}

function getCursorPosition(event)
{
    const rect = canvas.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top}
}