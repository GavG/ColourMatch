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
        color: "#EED",
        typeFace: (canvas.height / 30) + "px Arial",
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
                colorGridRows: 3,
                colorGridCols: 2,
                colorGrid: [
                    '#00F', '#22F',
                    '#40D', '#11E',
                    '#66D', '#22C',
                ],
                questionTimeout: 3_000,
                nextScene: 'level4',
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

function drawText(text, font, x = canvas.width / 2, y = canvas.height / 2, alignment = 'center')
{
    ctx.font = font.typeFace
    ctx.fillStyle = font.color
    ctx.textAlign = alignment
    ctx.fillText(text, x, y)
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
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    }
}

function countdown(time)
{
    drawText(time / 1_000, h1)
    for (let rem = time; rem > 0; rem -= 1_000) {
        setTimeout(function(rem){
            drawQuestionColor()
            drawText(rem / 1_000, h1)
        }, time - rem, rem)
    }
}

let colorQuestionListener = {
    target: window,
    type: 'click',
    function: function (e) {
        if (!currentScene.vars.colorGridDrawn) return false
        let pos = getCursorPosition(e)
        let col = Math.floor(pos.x / currentScene.vars.rectWidth)
        let row = Math.floor(pos.y / currentScene.vars.rectHeight)
        let selectedColIndex = col * currentScene.vars.colorGridCols + row

        if (selectedColIndex === currentScene.vars.chosenColor) {
            alert('WIN!')
            setNewScene(scenes[currentScene.vars.nextScene])
        } else {
            alert('NO!')
            setNewScene(scenes.menuScene)
        }
    },
}

function colorQuestionDraw() {
    currentScene.vars.colorGridDrawn  = false
    randomizeColorGrid()
    chooseColor()
    drawQuestionColor()
    setTimeout(drawColorGrid, currentScene.vars.questionTimeout)
    countdown(currentScene.vars.questionTimeout)
}