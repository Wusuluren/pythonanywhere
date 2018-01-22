const DIR_DOWN = 0
const DIR_UP = 1
const DIR_LEFT = 2
const DIR_RIGHT = 3
const IMAGE_PATH = '/static/js/snake'

let Snake = function(ctx) {
    let obj = {
        ctx: ctx,
        imgBody : new Image(),
        imgHead : new Image(),
        pos: [],
        xScale: 30,
        yScale: 30,
        direction: DIR_RIGHT,
        imgBodyLoadDone: false,
        imgHeadLoadDone: false,
    }
    obj.imgHead.src = IMAGE_PATH+"/head.png"
    obj.imgHead.onload = function() {
        obj.imgHeadLoadDone = true
        checkImgLoadDone()
    }
    obj.imgBody.src = IMAGE_PATH+"/body.png"
    obj.imgBody.onload = function() {
        obj.imgBodyLoadDone = true
        checkImgLoadDone()
    }
    obj.imgLoadDone = function() {
        return obj.imgBodyLoadDone && obj.imgHeadLoadDone
    }
    obj.movePosLeft = function(p) {
        p.x -= obj.xScale
        if (p.x < 0) {
            p.x = obj.width
        }
        return p
    }
    obj.movePosRight = function(p) {
        p.x += obj.xScale
        if (p.x > obj.width) {
            p.x = 0
        }
        return p
    }
    obj.movePosUp = function(p) {
        p.y -= obj.yScale
        if (p.y < 0) {
            p.y = obj.height
        } 
        return p
    }
    obj.movePosDown = function(p) {
        p.y += obj.yScale
        if (p.y > obj.height) {
            p.y = 0
        } 
        return p
    }
    obj.move = function() {
        obj.clear()
        let pHead = {x:obj.pos[0].x, y:obj.pos[0].y}
        switch (obj.direction) {
            case DIR_DOWN:
                pHead = obj.movePosDown(pHead)
                break
            case DIR_UP:
                pHead = obj.movePosUp(pHead)
                break
            case DIR_LEFT:
                pHead = obj.movePosLeft(pHead)
                break
            case DIR_RIGHT:
                pHead = obj.movePosRight(pHead)
                break
        }        
        for (let i = obj.pos.length-1; i > 0; i--) {
            obj.pos[i] = {x:obj.pos[i-1].x, y:obj.pos[i-1].y}
        }
        obj.pos[0] = pHead
        obj.draw()
    }
    obj.draw = function() {
        if (obj.pos.length > 1) {
            let oldHead = obj.pos[1]
            obj.ctx.drawImage(obj.imgBody, oldHead.x, oldHead.y, obj.xScale, obj.yScale)
            let head = obj.pos[0]
            obj.ctx.drawImage(obj.imgHead, head.x, head.y, obj.xScale, obj.yScale)
        } else {
            let head = obj.pos[0]
            obj.ctx.drawImage(obj.imgHead, head.x, head.y, obj.xScale, obj.yScale)
        }
    }
    obj.clear = function() { 
        if (obj.pos.length > 1) {
            let tail = obj.pos[obj.pos.length-1]
            obj.ctx.clearRect(tail.x, tail.y, obj.xScale, obj.yScale)
            let head = obj.pos[0]
            obj.ctx.clearRect(head.x, head.y, obj.xScale, obj.yScale)

        } else {
            let head = obj.pos[0]
            obj.ctx.clearRect(head.x, head.y, obj.xScale, obj.yScale)
        }
    }
    obj.incr = function() {
        // obj.clear()
        let last = obj.pos[obj.pos.length-1]
        let newBody = {x:last.x, y:last.y}
        if (obj.pos.length > 1) {
            let last2 = obj.pos[obj.pos.length-2]
            if (last2.y == last.y) {
                if (last.x > last2.x) {
                    newBody = obj.movePosRight(newBody)
                } else {
                    newBody = obj.movePosLeft(newBody)
                }
            }
            if (last2.x == last.x) {
                if (last.y > last2.y) {
                    newBody = obj.movePosDown(newBody)
                } else {
                    newBody = obj.movePosUp(newBody)
                }
            }
            obj.pos.push(newBody)
        } else { 
            switch (obj.direction) {
            case DIR_DOWN:
                newBody = obj.movePosUp(newBody)
                break
            case DIR_UP:
                newBody = obj.movePosDown(newBody)
                break
            case DIR_LEFT:
                newBody = obj.movePosRight(newBody)
                break
            case DIR_RIGHT:
                newBody = obj.movePosLeft(newBody)
                break
            }      
            obj.pos.push(newBody)
        }
        // obj.draw()
    }
    obj.keyHandler = function(event) {
        switch (event.key) {
            case 'w':
            case 'W':
                if (obj.direction != DIR_DOWN) {
                    obj.direction = DIR_UP
                }
                break
            case 's':
            case 'S':
                if (obj.direction != DIR_UP) {
                    obj.direction = DIR_DOWN
                }
                break
            case 'a':
            case 'A':
                if (obj.direction != DIR_RIGHT) {
                    obj.direction = DIR_LEFT
                }
                break
            case 'd':
            case 'D':
                if (obj.direction != DIR_LEFT) {
                    obj.direction = DIR_RIGHT
                }
                break
        }
    }
    obj.touchHandler = function(e) {
        if (e.touches != undefined && e.touches.length > 0) {
            let touch = e.touches[e.touches.length-1]
            let head = obj.pos[0]
            let diffX = touch.pageX - head.x
            let diffY = touch.pageY - head.y
            switch (obj.direction) {
                case DIR_LEFT:
                case DIR_RIGHT:
                    obj.direction = diffY > 0 ? DIR_DOWN : DIR_UP
                    break
                case DIR_UP:
                case DIR_DOWN:
                    obj.direction = diffX > 0 ? DIR_RIGHT : DIR_LEFT
                    break
            }
        }
    }
    obj.init = function(height, width) {
        obj.height = height - obj.yScale
        obj.width = width - obj.xScale
        obj.xNum = width / obj.xScale
        obj.yNum = height / obj.yScale

        let x = Math.random()*obj.width
        let y = Math.random()*obj.height
        x = Math.round(x/obj.xScale)*obj.xScale
        y = Math.round(y/obj.yScale)*obj.yScale
        newBody = {x:x, y:y}
        obj.pos.push(newBody)
    }
    return obj
}

let Food = function(ctx) {
    let obj = {
        ctx: ctx,
        imgFood : new Image(),
        x: 0,
        y: 0,
        xScale: 30,
        yScale: 30,
        imgFoodLoadDone: false,
    }
    obj.imgFood.src = IMAGE_PATH+"/food.png"
    obj.imgFood.onload = function() {
        obj.imgFoodLoadDone = true
        checkImgLoadDone()
    }
    obj.imgLoadDone = function() {
        return obj.imgFoodLoadDone
    }
    obj.draw = function() {
        obj.ctx.drawImage(obj.imgFood, obj.x, obj.y, obj.xScale, obj.yScale)
    }
    obj.clear = function() {
        obj.ctx.clearRect(obj.x, obj.y, obj.imgFood.height, obj.imgFood.width)
    }
    obj.renew = function() {
        obj.clear()
        obj.newFood()
        obj.draw()
    }
    obj.newFood = function() {
        let x = Math.random()*obj.width
        let y = Math.random()*obj.height
        x = Math.round(x/obj.xScale)*obj.xScale
        y = Math.round(y/obj.yScale)*obj.yScale
        obj.x = x
        obj.y = y
    }
    obj.init = function(height, width) {
        obj.height = height - obj.yScale
        obj.width = width - obj.xScale
        obj.xNum = width / obj.xScale
        obj.yNum = height / obj.yScale
        obj.newFood()
        obj.draw()
    }
    return obj
}

let Game = function() {
    let canvas = document.getElementById("snake_canvas") 
    let ctx = canvas.getContext("2d")
    let obj = {
        ctx : ctx,
        height : canvas.height,
        width : canvas.width,
        food : Food(ctx),
        snake : Snake(ctx),
        gameover: false,
    }
    obj.update = function() {
        if (obj.gameover) {
            return
        }
        obj.collision()
        obj.food.draw()
        obj.snake.move()
    }
    obj.init = function() {
        let height = Math.floor(window.innerHeight/30) *30
        let width = Math.floor(window.innerWidth/30) *30
        canvas.height = height
        canvas.width = width
        obj.food.init(height, width)
        obj.snake.init(height, width)
    }
    isSamePostion = function(a, b) {
        return (a.y == b.y) && (a.x == b.x)
    }
    obj.collision = function() {
        let head = obj.snake.pos[0]
        for (let p of obj.snake.pos) {
            if ((head !== p) && isSamePostion(head, p)) {
                obj.gameover = true
                alert('Game Over')
                return
            }
        }
        foodPos = {x:obj.food.x, y:obj.food.y}
        if (isSamePostion(obj.snake.pos[0], foodPos)) {
            obj.snake.incr()
            obj.food.renew()
        }
    }
    obj.imgLoadDone = function() {
        return obj.snake.imgLoadDone() && obj.food.imgLoadDone()
    }
    obj.start = function() {
        window.onkeypress = obj.snake.keyHandler
        window.ontouchstart = obj.snake.touchHandler
        window.setInterval(obj.update, 1000)
    }
    obj.init()
    return obj
}

let game = Game()
function checkImgLoadDone() {
    if (!game.imgLoadDone()) {
        return
    }
    game.start()
}