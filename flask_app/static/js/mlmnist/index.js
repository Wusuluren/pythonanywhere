let canvas
let context
let isDraw = false
let isSend = false

let canvasMin
let contextMin

function getPointOnCanvas(canvas, x, y) {
    let box = canvas.getBoundingClientRect()
    return {
        x: x - box.left * (canvas.width / box.width),
        y: y - box.top * (canvas.height / box.height)
    }
}

function canvasDown(pageX, pageY) {  
    if (isSend) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        contextMin.clearRect(0, 0, canvasMin.width, canvasMin.height)
        isSend = false
        $('#resultText').html('你猜我猜是什么')
    }    
    let loc = getPointOnCanvas(canvas, pageX, pageY)
    context.beginPath()
    context.moveTo(loc.x, loc.y)
    isDraw = true
}

function canvasMove(pageX, pageY) {
    if (isDraw) {
        let loc = getPointOnCanvas(canvas, pageX, pageY)
        context.lineTo(loc.x, loc.y)
        context.stroke()
    }
}

function canvasUp() {
    if (isDraw) {
        context.closePath()
        isDraw = false
    }
}

function canvasEventHandler(e) {
    e.preventDefault()    
    if (e.touches !== undefined && e.touches.length > 0) {
        // console.log('touch')
        let touch = e.touches[e.touches.length-1]
        if (e.type === 'touchstart') {
            canvasDown(touch.pageX, touch.pageY)
        } else if (e.type === 'touchmove') {
            canvasMove(touch.pageX, touch.pageY)
        } else if (e.type === 'touchend') {
            canvasUp()
        }
    } else {
        // console.log('mouse')
        if (e.type === 'mousedown') {
            canvasDown(e.pageX, e.pageY)
        } 
        else if (e.type === 'mousemove') {
            canvasMove(e.pageX, e.pageY)
        } else if (e.type === 'mouseup') {
            canvasUp()
        }
    }
}

function initCanvas() {
    let canvasDiv = document.getElementById('canvasDiv')
    canvas = document.createElement('canvas')
    canvas.setAttribute('width', 280)
    canvas.setAttribute('height', 280)
    canvas.setAttribute('style', 'border:1px solid #000000;')
    canvas.setAttribute('id', 'canvas')
    canvasDiv.appendChild(canvas)
    context = document.getElementById('canvas').getContext('2d')
    canvas.addEventListener('touchstart', canvasEventHandler, false)
    canvas.addEventListener('touchmove', canvasEventHandler, false)
    canvas.addEventListener('touchend', canvasEventHandler, false)
    $('#canvas').mousedown(canvasEventHandler)
    $('#canvas').mousemove(canvasEventHandler) 
    $('#canvas').mouseup(canvasEventHandler)

    let canvasDivMin = document.getElementById('canvasDivMin')
    canvasMin = document.createElement('canvas')
    canvasMin.setAttribute('width', 28)
    canvasMin.setAttribute('height', 28)
    canvasMin.setAttribute('style', 'border:1px solid #000000;')
    canvasMin.setAttribute('id', 'canvasMin')
    canvasDivMin.appendChild(canvasMin)
    contextMin = document.getElementById('canvasMin').getContext('2d')
    $('#canvasMin').hide()
}

function convertCanvasToImage() {
    let c = context.getImageData(0, 0, canvas.width, canvas.height)
    // console.log(c.data)
    // for (let i = 0; i < canvas.height*canvas.width; i++) {
    //     if (c.data[i*4+3] != 0) {
    //         console.log(c.data[i*4+3])
    //     }
    // }
    let data = c.data
    let dataPix = canvas.width/canvasMin.width*4
    let dataMin = new Array()
    for (let i = 0; i < canvasMin.width; i++) { // row
        for (let j = 0; j < canvasMin.height; j++) { //col
            let minX = 4*i
            let minY = canvasMin.width*4*j
            dataMin[minY+minX] = 0
            dataMin[minY+minX+1] = 0
            dataMin[minY+minX+2] = 0
            dataMin[minY+minX+3] = 0

            let rectX = dataPix*i
            let rectY = canvas.width*dataPix*j
            let hitNum = 0
            for (let m = 0; m < 10; m++) {
                for (let n = 0; n < 10; n++) {
                    let x = rectX+4*m
                    let y = rectY+canvas.width*4*n
                    if (data[y+x+3] > 0) {
                        hitNum += 1
                    }
                }
            }
            if (hitNum >= 1) {
                dataMin[minY+minX+3] = 255
            }
        }
    }
    // let cMin = contextMin.getImageData(0, 0, canvasMin.width, canvasMin.height)
    let minData = contextMin.createImageData(canvasMin.width, canvasMin.height)
    // console.log(minData.data)
    for (let i = 0; i < canvasMin.width*canvasMin.height*4; i++) {
        minData.data[i] = dataMin[i]
    }
    // cMin.data = dataMin
    // for (let i = 0; i < 28*28; i++) {
    //     if (minData.data[i*4+3] != 0) {
    //         console.log(minData.data[i*4+3])
    //     }
    // }    
    contextMin.putImageData(minData, 0, 0)
    cMin = contextMin.getImageData(0, 0, canvasMin.width, canvasMin.height)
    // for (let i = 0; i < 28*28; i++) {
    //     if (cMin.data[i*4+3] != 0) {
    //         console.log(cMin.data[i*4+3])
    //     }
    // }
    let dataImg = new Array()
    for (let i = 0; i < canvasMin.width; i++) { // row
        for (let j = 0; j < canvasMin.height; j++) { //col
            let minX = 4*i
            let minY = canvasMin.width*4*j
            dataImg[j*canvasMin.width+i] = dataMin[minY+minX+3] > 0 ? 1 : 0
        }
    }
    // for (let i = 0; i < 28*28; i++) {
    //     if (dataImg[i] != 0) {
    //         console.log(dataImg[i])
    //     }
    // }
    return dataImg
}

$(document).ready(function() {
    initCanvas()
    $('#sendButton').click(function() {
        $('#resultText').html('正在猜测...')
        let dataImg = convertCanvasToImage()
        isSend = true
        let htmlobj =  $.ajax({
            url:"/mlmnist/result", 
            type:'POST', 
            data: {img_data: JSON.stringify(dataImg)},
            cache: false,
            // async:false, 

            success:function (str) {
                $('#resultText').html('我猜是'+str)
            }})
    })

    $('#clearButton').click(function() {
        context.closePath()
        context.clearRect(0, 0, canvas.width, canvas.height)
        isDraw = false
    })

    $('#lineWidthButton').click(function() {
        context.lineWidth = $('#lineWidthInput').val()
        context.closePath()
        isDraw = false
        isSend = true
    })
})