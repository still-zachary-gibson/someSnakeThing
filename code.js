const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const scale = 640/4
canvas.width = 1280//4 + 20*4*10
canvas.height = 720//4 + 20*3*10;
const ctx = canvas.getContext("2d");

const print = (n) => console.log(n)

const convert = (n) => {
    return n * Math.PI/180
}

const modulo = (n,d) =>
{
    if(n % d >= 0)
    {
        return n % d
    }
    else
    {
        return d + (n % d)
    }
}

const floor = (n) => Math.floor(n)

ctx.fillStyle = "white"
ctx.rect(0,0,canvas.width,canvas.height)
ctx.fill()

let frameCount = 0

const clamp = (n,min,max) => Math.min(Math.max(n, min), max);

//let current_snake = null

const randInt = (min,max,step=1) => Math.floor((Math.random() * (max - min + 1))/step)*step + min;

class Snake
{
    constructor(board){
        this.board = board
        this.x = 42
        this.y = 42
        this.moving = false
        this.tail_array = [[floor((this.x)/20),floor((this.y)/20), 0]]
        
        this.direction = 0
        this.speed = 5/2
        this.next_dir = 0
        this.appling = 0
        this.lost = false
        for(var i = 1; i < 4; i++)
        {
            this.tail_array.push([floor((this.x)/20)-i,floor((this.y)/20), 0])
        }
        this.input_poll = this.input_poll.bind(this);
        self.addEventListener("keydown", this.input_poll, false);
    }
    draw()
    {
        ctx.beginPath();
        ctx.lineWidth = 5
        ctx.strokeStyle = "green"
        if(this.lost)
            ctx.strokeStyle = "darkgreen"
        ctx.lineTo(this.x,this.y)
        const yello_tail = false
        for(var i = 1; i < this.tail_array.length; i++)
        {
            ctx.lineTo(this.tail_array[i][0]*20+2, this.tail_array[i][1]*20+2)
            if(i + 1 == this.tail_array.length)
            {
                if(yello_tail)
                {
                    ctx.stroke();
                    ctx.beginPath()
                    ctx.strokeStyle = "yellow"
                    ctx.lineTo(this.tail_array[i][0]*20+2, this.tail_array[i][1]*20+2)
                }

                var x_dif = Math.abs(floor((this.x - 2 + 10 + 10*Math.cos(convert(this.direction)))/20)*20 - (this.x - 2))

                if(x_dif == 20)
                    x_dif = 0

                var y_dif = Math.abs(floor((this.y - 2 + 10 - 10*Math.sin(convert(this.direction)))/20)*20 - (this.y- 2))

                if(y_dif == 20)
                    y_dif = 0

                var yeah = x_dif + y_dif

                ctx.lineTo(this.tail_array[i][0]*20+2 - Math.cos(convert(this.tail_array[i][2]))*yeah-this.appling*Math.cos(convert(this.tail_array[i][2]))*10,
                this.tail_array[i][1]*20+2 + Math.sin(convert(this.tail_array[i][2]))*yeah+this.appling*Math.sin(convert(this.tail_array[i][2]))*10)
            }
        }
        ctx.stroke();
        
        ctx.beginPath()
        if(this.lost)
            ctx.strokeStyle = "green"
        else
            ctx.strokeStyle = "lightgreen"

        const head_size = 4
        ctx.lineWidth = head_size
        ctx.lineTo(this.x + Math.sin(convert(this.direction))*head_size,this.y + Math.cos(convert(this.direction))*head_size)
        ctx.lineTo(this.x - Math.sin(convert(this.direction))*head_size,this.y - Math.cos(convert(this.direction))*head_size)
        ctx.lineTo(this.x + Math.cos(convert(this.direction))*head_size,this.y - Math.sin(convert(this.direction))*head_size)

        ctx.closePath()

        ctx.stroke()
    }
    move()
    {
        if(this.moving && !this.lost)
        {
            if(this.appling != 0)
                this.appling = clamp(this.appling*1.5,0,2)
            this.x += Math.cos(convert(this.direction))*this.speed
            this.y -= Math.sin(convert(this.direction))*this.speed
            this.tail_array[0] = [floor(this.x/20),floor(this.y/20), this.direction]
        }
    }
    turn()
    {
        this.collide()
        if(this.lost)
            return
        for(var i = this.tail_array.length-1; i > 0; i--)
        {
            this.tail_array[i] = this.tail_array[i-1]
        }
        this.appling = 0
        if(modulo(this.next_dir-180, 360) != this.direction)
            this.direction = this.next_dir
        this.eated_apple()
    }
    eated_apple()
    {
        for(var i in this.board.apple_list)
        {
            if(this.x-2 == this.board.apple_list[i].x && this.y-2 == this.board.apple_list[i].y)
            {
                delete this.board.apple_list[i]
                this.board.apple_list.splice(i,1)
                this.tail_array.push(this.tail_array[this.tail_array.length-1])
                this.appling = 0.1
                break
            }
        }
    }
    collide()
    {
        if (this.x <= 2 || this.x + 2 >= this.board.w || this.y <= 2 || this.y + 2 >= this.board.h)
        {
            this.lost = true
            this.moving = false
        }
        for(var i = 1; i < this.tail_array.length; i++)
        {
            if(floor(this.x/20) == this.tail_array[i][0] && floor(this.y/20) == this.tail_array[i][1])
            {
                this.lost = true
                this.moving = false
            }
        }
    }
    input_poll(event)
    {
        if(!this.board.running && !this.lost)
            return
        this.moving = true
        if(event.key == "ArrowDown" && this.next_dir != 270 && this.next_dir != 90)
        {
            this.next_dir = 270
        }
        else if(event.key == "ArrowLeft" && this.next_dir != 180 && this.next_dir != 0)
        {
            this.next_dir = 180
        }
        else if(event.key == "ArrowRight" && this.next_dir != 0 && this.next_dir != 180)
        {
            this.next_dir = 0
        }
        else if(event.key == "ArrowUp" && this.next_dir != 90 && this.next_dir != 270)
        {
            this.next_dir = 90
        }
    }
}

class Apple
{
    constructor(x,y,parent)
    {
        this.x = x
        this.y = y
        this.board = parent
        parent.apple_list.push(this)
    }
    draw()
    {
        ctx.beginPath()
        ctx.arc(this.x+2.5,this.y+2.5,5,0,2*Math.PI)
        ctx.fillStyle = "red"
        ctx.fill()
        ctx.fillStyle = "white"
    }
}

class GameBoard{
    constructor(x,y,w,h,title,icon=false)
    {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.bar_width = 30
        this.window_title = title
        this.icon = false
        if(icon != false)
        {
            this.icon = new Image()
            this.icon.src = icon
        }
        this.bg_color = "white"
        this.draw = this.draw.bind(this);
        this.draw_pre = this.draw_pre.bind(this);
        this.draw_post = this.draw_post.bind(this);
        this.draw_window_bar = this.draw_window_bar.bind(this);
        this.targetFrame = 60
        this.running = true
        this.keys = new Map()
        this.startFrame = performance.now()
        this.fps = 0
        this.doFPS = false
        this.beingGrabbed = false
        this.active = true
        
        this.key_press = this.key_press.bind(this);
        self.addEventListener("keydown", this.key_press, false);
        this.key_release = this.key_release.bind(this);
        self.addEventListener("keyup", this.key_release, false);

        this.mouse_works = this.mouse_works.bind(this);
        self.addEventListener("mousedown", this.mouse_works, false);
        this.mouse_moves = this.mouse_moves.bind(this);
        self.addEventListener("mousemove", this.mouse_moves, false);
        this.mouse_unworks = this.mouse_unworks.bind(this);
        self.addEventListener("mouseup", this.mouse_unworks, false);

        var what_put_in = String(title)+"_1"

        var not_true = false
        while(!not_true)
        //for(var j = 0; j < 11; j++)
        {
            not_true = true
            for(var i in programList)
            {
                if(what_put_in == programList[i][3])
                {
                    not_true = false
                    break
                }
            }
            if(!not_true)
            {
                var okay_fine = what_put_in.split("_")
                var name_ = Number(okay_fine[okay_fine.length-1])+1
                what_put_in = ""
                for(var i = 0; i < okay_fine.length-1; i++)
                {
                    what_put_in += okay_fine[i] + "_"
                }
                what_put_in += String(name_)
            }
            //what_put_in = what_put_in.substring(0,what_put_in.length-1)
        }

        //print(what_put_in)

        programList.push([this, JSON.parse(JSON.stringify(this.targetFrame)), 0, what_put_in])

        this.my_name = what_put_in
    }
    draw_pre(do_work)
    {
        if(this.doFPS && do_work)
        {
            var current_time = performance.now()
            this.fps = (1000 / (current_time - this.startFrame))
            this.startFrame = current_time
        }
        ctx.save()
        ctx.translate(this.x,this.y+this.bar_width)
        var border = new Path2D()
        border.rect(0, 0, this.w, this.h);
        ctx.clip(border);
        ctx.fillStyle = this.bg_color
        ctx.fillRect(0,0,this.w,this.h)
    } 
    draw(do_work)
    {
        //if(!active)
        //    return
        
        this.draw_pre(do_work)
        this.draw_post(do_work)
        this.draw_window_bar(do_work)
        //this.draw_hud_pre()
        //this.draw_hud_post()
    }
    draw_post(do_work)
    {
        if(this.doFPS)
        {
            ctx.font = "30px sans-serif"
            ctx.fillStyle = "rgba(255,0,0,0.4)"
            ctx.fillText("FPS:"+String(floor(this.fps*10)/10),2,30)
        }
        ctx.lineWidth = 4
        ctx.strokeStyle = "black"
        ctx.strokeRect(1,1,this.w-2,this.h-2)
        ctx.restore()
    }
    draw_window_bar(do_work)
    {
        ctx.save()
        ctx.translate(this.x,this.y)
        var border = new Path2D()
        border.rect(0, 0, this.w, this.bar_width);
        ctx.clip(border);
        ctx.fillStyle = "lightgray"
        ctx.fillRect(0,0,this.w,this.h)

        ctx.fillStyle = "black"

        ctx.font = String(this.bar_width/1.5)+"px sans-serif"

        if(this.icon == false)
            ctx.fillText(this.window_title,10,this.bar_width/1.25)
        else
        {
            ctx.drawImage(this.icon, 1, 1)
            
            ctx.fillText(this.window_title,5 + this.icon.width,this.bar_width/1.25)
        }

        ctx.fillStyle = "red"
        ctx.fillRect(this.w-30,this.bar_width/5,25, this.bar_width/1.5)
        ctx.fillStyle = "black"
        ctx.fillText("X",this.w-24,this.bar_width/1.25)
        ctx.strokeStyle = "black"
        ctx.strokeRect(this.w-30,this.bar_width/5,25, this.bar_width/1.5)

        ctx.fillStyle = "gray"
        ctx.fillRect(this.w-60,this.bar_width/5,25, this.bar_width/1.5)
        ctx.fillStyle = "black"
        ctx.fillText("-",this.w-24*2-3,this.bar_width/1.5)
        ctx.strokeStyle = "black"
        ctx.strokeRect(this.w-60,this.bar_width/5,25, this.bar_width/1.5)

        ctx.lineWidth = 2
        ctx.strokeStyle = "black"
        ctx.strokeRect(1,1,this.w-2,this.bar_width)
        ctx.restore()
    }
    key_press(event)
    {
        if(!this.active)
            return -1
        if(!this.keys.has(event.key))
            this.keys.set(event.key, 1)
        else
            this.keys.set(event.key, this.keys.get(event.key)+1)
        return this.keys.get(event.key)
    }
    key_release(event)
    {
        this.keys.delete(event.key)
    }
    change_fps(frameRate)
    {
        //clearInterval(this.frames)
        //this.frames = setInterval(this.draw,1000/frameRate)
        this.targetFrame = frameRate
        programList[this.my_name][1] = this.targetFrame
    }
    mouse_works(event)
    {
        if(!this.active)
            return
        const rect = canvas.getBoundingClientRect()
        if(event.x - rect.left >= this.x && event.y - rect.top >= this.y && event.x - rect.left <= this.x + this.w && event.y - rect.top <= this.y + this.bar_width + this.w)
        {
            //print("ME: " + String(this.my_name))
            var reached = -1
            //print(typeof(programList))
            for(var i in programList)
            {
                if(reached == -1)
                {
                    if(programList[i][0].my_name == this.my_name)
                    {
                        reached = i
                        continue
                    }
                }
                else
                {
                    if(event.x - rect.left >= programList[i][0].x && event.y - rect.top >= programList[i][0].y &&
                    event.x - rect.left <= programList[i][0].x + programList[i][0].w && event.y - rect.top <= programList[i][0].y + programList[i][0].bar_width + programList[i][0].w)
                    {
                        return
                    }
                }
            }
            programList.splice(reached,1)
            programList.push([this, JSON.parse(JSON.stringify(this.targetFrame)), 0, this.my_name])
            //print(programList)
            if(event.x - rect.left >= this.x && event.y - rect.top >= this.y && event.x - rect.left <= this.x + this.w && event.y - rect.top <= this.y + this.bar_width)
            {
                if(event.x - rect.left >= this.x + this.w - 60 && event.x - rect.left <= this.x + this.w - 60+25 && event.y - rect.top >= this.y + this.bar_width/5 && event.y - rect.top <= this.y + this.bar_width/1.5)
                {
                    this.active = false
                    this.beingGrabbed = false
                    return
                }
                if(event.x - rect.left >= this.x + this.w - 30 && event.x - rect.left <= this.x + this.w - 30+25 && event.y - rect.top >= this.y + this.bar_width/5 && event.y - rect.top <= this.y + this.bar_width/1.5)
                {
                    this.active = false
                    programList.splice(reached,1)
                    this.beingGrabbed = false
                    /*Object.keys(this).forEach(v => {print(String(v) + ": " + String(this[v]))})
                    Object.keys(this).forEach(v => {this[v] = null})
                    this.keys = new Map()
                    print("_____")
                    Object.keys(this).forEach(v => {print(String(v) + ": " + String(this[v]))})*/
                    return
                }
                this.beingGrabbed = [event.x - rect.left - this.x, event.y - rect.top - this.y]
                //print(this.beingGrabbed)
            }
        }
    }
    mouse_moves(event)
    {
        if(this.beingGrabbed == false)
            return
        const rect = canvas.getBoundingClientRect()
        this.x += event.x - rect.left - this.x - this.beingGrabbed[0]
        this.y += event.y - rect.top - this.y - this.beingGrabbed[1]
    }
    mouse_unworks(event)
    {
        if(this.beingGrabbed != false)
            this.beingGrabbed = false
    }
    static time_to_time(current_time) {
        var seconds = floor(current_time / 1000)
        var hours = ""
        if(seconds > 59)
        {
            minutes = floor(seconds/60)
            seconds = seconds % 60
            if(minutes > 59)
            {
                hours = floor(minutes/60)
                hours = String(hours) + ":"
                minutes = minutes % 60
                if(minutes < 10)
                    minutes = "0" + String(minutes)
            }
        }
        else
        {
            var minutes = "0"
        }
        minutes = String(minutes) + ":"
        if(seconds < 10)
            minutes = String(minutes) + "0"
        return String(hours) + String(minutes) + String(seconds)
    }
}

class SnakeBoard extends GameBoard
{
    constructor(x,y,w,h)
    {
        super(x,y,w,h,"Snake", "Images/snakeIcon.png")
        this.current_snake = null
        this.appleAmount = 1
        this.apple_list = []
        this.time_started = 0
        this.time_shown = "0:00"
        this.subtract_time = 0
        this.wait_time = 0
    }
    draw(do_work)
    {
        if(!this.active)
            return
        var basic_pos = [this.x,this.y]
        super.draw_pre(do_work)
        const size = 40
        for(var i = 0; i < 22; i++)
        {
            for(var j = 0; j < 22; j++)
            {
                ctx.strokeStyle = "rgba(255,0,0,0.25)"
                ctx.strokeRect(2+size*i,2+size*j,size,size)
                ctx.strokeStyle = "rgba(128, 0, 0, 0.125)"
                ctx.strokeRect(-18+size*i,-18+size*j,size,size)
            }
        }
        if(do_work)
            if(this.appleAmount > this.apple_list.length)
            {
                while (true)
                {
                    var x_pos = randInt(20,Math.floor(this.w/20)*20-20,20)
                    var y_pos = randInt(20,Math.floor(this.h/20)*20-20,20)
                    var good_to_go = true
                    if(this.current_snake == null)
                        break
                    for(var i in this.current_snake.tail_array)
                    {
                        if(x_pos/20 == this.current_snake.tail_array[i][0] && y_pos/20 == this.current_snake.tail_array[i][1])
                        {
                            good_to_go = false
                            break
                        }
                    }
                    if(good_to_go)
                        break
                }
                new Apple(x_pos,y_pos,this)
            }
        if(this.current_snake == null)
        {
            this.current_snake = new Snake(this)
        }
        else
        {
            if(frameCount % 1 == 0 && this.running && do_work)
            {
                if((this.current_snake.x % 20) == 2 && (this.current_snake.y % 20) == 2 && this.current_snake.moving)
                {
                    this.current_snake.turn()
                }
                this.current_snake.move()
            }
            this.current_snake.draw()
        }
        
        for(var i in this.apple_list)
        {
            this.apple_list[i].draw()
        }
        super.draw_post(do_work)

        if(this.current_snake != null)
        {
            if(this.current_snake.moving && !this.current_snake.lost && this.running)
            {
                if(this.time_started == 0)
                    this.time_started = performance.now()
                this.time_shown = GameBoard.time_to_time(performance.now() - this.time_started - this.subtract_time)

            }
        }

        this.window_title = "Snake | " + this.time_shown + " | Apples: " + String(this.current_snake.tail_array.length-4)

        super.draw_window_bar()

        this.x = basic_pos[0]
        this.y = basic_pos[1]
    }
    key_press(event)
    {
        if(super.key_press(event) == 1)
        {
            if(event.key == "Enter")
            {
                if(this.current_snake != null)
                {
                    if(!this.current_snake.lost && !this.current_snake.moving)
                        return
                    if(this.current_snake.lost)
                    {
                        this.time_shown = "0:00"
                        this.time_started = 0
                        this.running = false
                        this.subtract_time = 0
                        delete this.current_snake
                        for(var i in this.apple_list)
                        {
                            delete this.apple_list[i]
                        }
                        this.apple_list = []
                    }
                    else
                    {
                        if(this.running)
                            this.wait_time = performance.now()
                        else
                        {
                            this.subtract_time += performance.now() - this.wait_time
                            //print(this.subtract_time)
                            this.wait_time = 0
                        }
                    }
                }
                this.running = !this.running
            }
            else if (event.key == "[" && this.doFPS)
            {
                super.change_fps(this.targetFrame/2)
            }
            else if (event.key == "]" && this.doFPS)
            {
                super.change_fps(this.targetFrame*2)
            }
            else if (event.key == "t")
            {
                new SnakeBoard(this.x + 20, this.y + 20, this.w, this.h)

               print(programList)
            }
        }
    }
}

let programList = []

let TaskBar = {
    manage_programs ()
    {
        clearCanvas()
        for(var i in programList)
        {
            //print(programList[i])
            if(!programList[i][0].active)
                continue
            if(programList[i][2] >= 100)
            {
                if(programList[i][1] < 100)
                    programList[i][2] = 0
                programList[i][0].draw(true)
            }
            else
            {
                programList[i][2] += programList[i][1]//++
                programList[i][0].draw(false)
            }
        }

        requestAnimationFrame(TaskBar.manage_programs)
    },
    
}

//setInterval(TaskBar.manage_programs, 1)
requestAnimationFrame(TaskBar.manage_programs)

let FPS_Show = false
let fps_counter = document.getElementById("FPS")
last_frame = performance.now()

function frame()
{
    frameCount++
    if(FPS_Show)
    {
        var current_time = performance.now()
        fps_counter.innerHTML = "FPS: " + String((current_time - last_frame))
        last_frame = performance.now()
    }
}

let can_clear = true

function clearCanvas()
{
    /*if (can_clear)
    {*/
        //ctx.fillRect
        ctx.save()
        ctx.fillStyle = "blue"
        ctx.setTransform(1,0,0,1,0,0)
        ctx.fillRect(0,0,canvas.width,canvas.height)
        ctx.restore()
        can_clear = false
  //  }
}

/*sname = */new SnakeBoard(200,0,400+4,400+4)
/*snaker = new SnakeBoard(400,0,400,400)
snakert = new SnakeBoard(0,400,400,400)
snakerber = new SnakeBoard(400,400,400,400)*/

frame()

setInterval(frame,1000/60)
/*
function allowForThing()
{
    can_clear = true
    requestAnimationFrame(allowForThing)
}

requestAnimationFrame(allowForThing)*/