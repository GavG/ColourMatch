window.addEventListener('load', init)

//Objects
let canvas, ctx

//Setup Values
let dpi = window.devicePixelRatio;

//FillStyles
let menuBackground

//Fonts
let fonts

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

    setNewScene(scenes.menu)
}

function resizeCanvas()
{
    let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2)
    let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2)

    canvas.height = style_height * dpi
    canvas.width = style_width * dpi

    initFonts()
    drawCurrentScene()
}

function initColors()
{
    menuBackground = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    menuBackground.addColorStop(0, "#E33")
    menuBackground.addColorStop(1, "#E66")    
}

function initFonts()
{
    fonts = {
        h1: {
            color: "#DE4",
            typeFace: (canvas.height / 30) + "px Arial",
        },

        h2: {
            color: "#EED",
            typeFace: (canvas.height / 40) + "px Arial",
        },

        h3: {
            color: "#000",
            typeFace: (canvas.height / 30) + "px Arial",
        },
    }
}

function initScenes()
{
    scenes = {

        menu: {
            draw: function()
            {
                ctx.fillStyle = menuBackground
                ctx.fillRect(0, 0, canvas.width * dpi, canvas.height * dpi)
                drawText("COLOUR MATCH", fonts.h1)
                drawText("Click to play", fonts.h2, canvas.width / 2, canvas.height * 0.66)
            },
            listeners: [
                {
                    target: window,
                    type: 'click',
                    function: (e) => setNewScene(getHighestLevel()),
                }
            ]
        },

        finish: {
            draw: function () {
                ctx.fillStyle = menuBackground
                ctx.fillRect(0, 0, canvas.width * dpi, canvas.height * dpi)
                drawText("Thanks For Playing", fonts.h1)
            },
            listeners: [

            ]
        },

        level1: {
            vars:{
                colorGridRows: 2,
                colorGridCols: 2,
                colorGrid: [
                    '#FFF', '#CCC',
                    '#999', '#555',
                ],
                questionTimeout: 3_000,
                nextScene: 'level2',
            },
            draw: colorQuestionDraw,
            listeners: [colorQuestionListener]
        },

        level2: {
            vars: {
                colorGridRows: 2,
                colorGridCols: 2,
                colorGrid: [
                    '#FF0', '#CC0',
                    '#770', '#330',
                ],
                questionTimeout: 3_000,
                nextScene: 'level3',
            },
            draw: colorQuestionDraw,
            listeners: [colorQuestionListener]
        },

        level3: {
            vars: {
                colorGridRows: 2,
                colorGridCols: 2,
                colorGrid: [
                    '#003', '#008',
                    '#00C', '#00F',
                ],
                questionTimeout: 3_000,
                nextScene: 'level4',
            },
            draw: colorQuestionDraw,
            listeners: [colorQuestionListener]
        },

        level4: {
            vars: {
                colorGridRows: 2,
                colorGridCols: 2,
                colorGrid: [
                    '#411', '#600',
                    '#D22', '#F00',
                ],
                questionTimeout: 3_000,
                nextScene: 'finish',
            },
            draw: colorQuestionDraw,
            listeners: [colorQuestionListener]
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
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
}

function drawText(
    text,
    font,
    x = canvas.width / 2,
    y = canvas.height / 2,
    alignment = 'center',
    stroke = '#666',
    strokeWidth = 2
)
{
    ctx.font = font.typeFace
    ctx.fillStyle = font.color
    ctx.textAlign = alignment
    ctx.fillText(text, x, y)

    if(stroke){
        ctx.strokeStyle = stroke
        ctx.lineWidth = strokeWidth
        ctx.strokeText(text, x, y)
    }
}

function randomizeColorGrid()
{
    shuffleArray(currentScene.vars.colorGrid)
}

function drawColorGrid()
{
    currentScene.vars.rectWidth = canvas.width / currentScene.vars.colorGridCols
    currentScene.vars.rectHeight = canvas.height / currentScene.vars.colorGridRows

    let colIndex = 0

    for (let row = 0; row < currentScene.vars.colorGridRows; row++) {
        for (let col = 0; col < currentScene.vars.colorGridCols; col++) {
            ctx.fillStyle = currentScene.vars.colorGrid[colIndex]
            ctx.fillRect(
                col * currentScene.vars.rectWidth,
                row * currentScene.vars.rectHeight,
                currentScene.vars.rectWidth,
                currentScene.vars.rectHeight
            )
            colIndex++
        }
    }

    currentScene.vars.colorGridDrawn = true
}

function chooseColor()
{
    currentScene.vars.chosenColor = Math.floor(Math.random() * currentScene.vars.colorGrid.length)
}

function drawQuestionColor()
{
    ctx.fillStyle = currentScene.vars.colorGrid[currentScene.vars.chosenColor]
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function getCursorPosition(event)
{
    const rect = canvas.getBoundingClientRect()

    return {
        x: (event.clientX - rect.left) * dpi,
        y: (event.clientY - rect.top) * dpi,
    }
}

function countdown(time)
{
    drawText(time / 1_000, fonts.h1)
    for (let rem = time; rem > 0; rem -= 1_000) {
        setTimeout(function(rem){
            drawQuestionColor()
            drawText(rem / 1_000, fonts.h1)
        }, time - rem, rem)
    }
}

let colorQuestionListener = {
    target: window,
    type: 'click',
    function: function (e) {
        
        if (currentScene.vars.levelComplete){
            setHighestLevel(currentScene.vars.nextScene)
            return setNewScene(scenes[currentScene.vars.nextScene])
        }

        if (!currentScene.vars.colorGridDrawn) return false
        
        let pos = getCursorPosition(e)
        let col = Math.floor(pos.x / currentScene.vars.rectWidth)
        let row = Math.floor(pos.y / currentScene.vars.rectHeight)
        let selectedColIndex = (row * currentScene.vars.colorGridRows) + col

        if (selectedColIndex === currentScene.vars.chosenColor) {
            ctx.fillStyle = '#FFF'
            ctx.fillRect(0, 0, canvas.height * dpi, canvas.width * dpi)
            drawText('Correct! Click to continue...', fonts.h3)
            currentScene.vars.levelComplete = true
        } else {
            alert('NO!')
            setHighestLevel('level1')
            setNewScene(scenes.menu)
        }
    },
}

function colorQuestionDraw() {
    currentScene.vars.colorGridDrawn  = false
    currentScene.vars.levelComplete = false
    randomizeColorGrid()
    chooseColor()
    drawQuestionColor()
    setTimeout(drawColorGrid, currentScene.vars.questionTimeout)
    countdown(currentScene.vars.questionTimeout)
}

function getHighestLevel()
{
    return scenes[localStorage.getItem('highestLevel') || 'level1']
}

function setHighestLevel(levelName)
{
    localStorage.setItem('highestLevel', levelName)
}