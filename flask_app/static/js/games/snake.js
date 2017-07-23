const DIR_DOWN = 0
const DIR_UP = 1
const DIR_LEFT = 2
const DIR_RIGHT = 3

let Snake = function(ctx) {
    let obj = {
        ctx: ctx,
        imgBody : new Image(),
        imgHead : new Image(),
        pos: [],
        xScale: 30,
        yScale: 30,
        direction: DIR_RIGHT,
    }
    obj.imgBody.src = "/static/js/games/body.png"
    obj.imgHead.src = "/static/js/games/head.png"
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
    }
    obj.imgFood.src = "/static/js/games/food.png"
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
        snake : Snake(ctx),
        food : Food(ctx),
        gameover: false,
    }
    obj.update = function() {
        if (obj.gameover) {
            return
        }
        obj.collision()
        obj.snake.move()
    }
    obj.init = function() {
        let height = canvas.height
        let width = canvas.width
        obj.snake.init(height, width)
        obj.food.init(height, width)
    }
    isSamePostion = function(a, b) {
        return (a.y == b.y) && (a.x == b.x)
    }
    obj.collision = function() {
        for (let i = 0; i < obj.snake.pos.length; i++) {
            let p = obj.snake.pos[i]
            for (let j = 0; j <  obj.snake.pos.length; j++) {
                let p2 = obj.snake.pos[j]
                if ((i != j) && isSamePostion(p, p2)) {
                    obj.gameover = true
                    alert('Game Over')
                    return
                }
            }
        }
        foodPos = {x:obj.food.x, y:obj.food.y}
        if (isSamePostion(obj.snake.pos[0], foodPos)) {
            obj.snake.incr()
            obj.food.renew()
        }
    }
    obj.init()
    window.onkeypress = obj.snake.keyHandler
    window.setInterval(obj.update, 1000)
    return obj
}

let main_ = function() {
    let game = Game()
}
main_()