const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const scale = 640/4
canvas.width = 4 + 20*4*10
canvas.height = 4 + 20*3*10;
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

let current_snake = null

const randInt = (min,max,step=1) => Math.floor((Math.random() * (max - min + 1))/step)*step + min;

class Snake
{
    constructor(board){
        this.board = board
        this.x = 42 + this.board.x
        this.y = 42 + this.board.y
        this.moving = false
        this.tail_array = [[floor((this.x)/20),floor((this.y)/20), 0]]
        this.direction = 0
        this.speed = 5/2
        this.next_dir = 0
        this.appling = 0
        this.appling_power = 0.5
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
        const yello_tail = true
        for(var i = 1; i < this.tail_array.length; i++)
        {
            //if(i + 1 < this.tail_array.length)
            ctx.lineTo(this.board.x + this.tail_array[i][0]*20+2, this.board.y + this.tail_array[i][1]*20+2)
            if(i + 1 == this.tail_array.length)
            //else
            {
                if(yello_tail)
                {
                    ctx.stroke();
                    ctx.beginPath()
                    ctx.strokeStyle = "yellow"
                    ctx.lineTo(this.board.x + this.tail_array[i][0]*20+2, this.board.y + this.tail_array[i][1]*20+2)
                }
                ///var x_dif = 20

                var x_dif = Math.abs(floor((this.x - this.board.x - 2 + 10 + 10*Math.cos(convert(this.direction)))/20)*20 - (this.x - this.board.x - 2))

                if(x_dif == 20)
                    x_dif = 0

                var y_dif = Math.abs(floor((this.y - this.board.y - 2 + 10 - 10*Math.sin(convert(this.direction)))/20)*20 - (this.y - this.board.y - 2))

                if(y_dif == 20)
                    y_dif = 0

                var yeah = x_dif + y_dif

                //x_dif 20 at the line point
                //ctx.lineTo(this.board.x + this.tail_array[i][0]*20+2 - Math.cos(convert(this.tail_array[i][2]))*x_dif, this.board.y + this.tail_array[i][1]*20+2 + Math.sin(convert(this.tail_array[i][2]))*length)*/

                ctx.lineTo(this.board.x + this.tail_array[i][0]*20+2 - Math.cos(convert(this.tail_array[i][2]))*yeah-this.appling*Math.cos(convert(this.tail_array[i][2]))*10,
                this.board.y + this.tail_array[i][1]*20+2 + Math.sin(convert(this.tail_array[i][2]))*yeah+this.appling*Math.sin(convert(this.tail_array[i][2]))*10)
            }
        }
        //print(this.tail_array)
        ctx.stroke();
    }
    move()
    {
        if(this.moving && !this.lost)
        {
            /*if(this.appling != false)
            {
                this.tail_array[this.tail_array.length-1][0] += (this.appling[0] - this.tail_array[this.tail_array.length-1][0])/this.speed
                this.tail_array[this.tail_array.length-1][1] += (this.appling[1] - this.tail_array[this.tail_array.length-1][1])/this.speed
                //print(this.tail_array[this.tail_array.length-1])
            }*/
            if(this.appling != 0)
            {
                this.appling = clamp(this.appling*1.5,0,2)
                //print(this.appling)
                //this.appling = /*clamp(*/this.appling+this.speed/*/0.7,0,20)*/
                //this.appling_power *= 1.1
            }
            this.x += Math.cos(convert(this.direction))*this.speed
            this.y -= Math.sin(convert(this.direction))*this.speed
            //print(this.tail_array)
            this.tail_array[0] = [floor(this.x/20),floor(this.y/20), this.direction]
        }
    }
    turn()
    {
        this.collide()
        if(this.lost)
            return
        /*if(this.appling != false)
        {
            var save_var = this.tail_array[this.tail_array.length-1]
        }*/
        for(var i = this.tail_array.length-1; i > 0; i--)
        {
            this.tail_array[i] = this.tail_array[i-1]
            //print(String(i) +": " + String(this.tail_array[i][0]))
        }
        /*if(this.appling != false)
        {
            this.tail_array[this.tail_array.length-1] = save_var
            this.appling = false
        }*/
        this.appling = 0
        //this.appling_power = 0.2
        if(modulo(this.next_dir-180, 360) != this.direction)
            this.direction = this.next_dir
        this.eated_apple()
    }
    eated_apple()
    {
        for(var i in apple_list)
        {
            if(this.x-2 == apple_list[i].x && this.y-2 == apple_list[i].y)
            {
                delete apple_list[i]
                apple_list.splice(i,1)
                this.tail_array.push(this.tail_array[this.tail_array.length-1])
                //print(Math.cos(convert(this.tail_array[this.tail_array.length-1][2])))
                this.appling = 0.1
                //this.appling = [this.tail_array[this.tail_array.length-1][0] - Math.cos(convert(this.tail_array[this.tail_array.length-1][2])), this.tail_array[this.tail_array.length-1][1] - Math.sin(convert(this.tail_array[this.tail_array.length-1][2]))]
                break
            }
        }
    }
    collide()
    {
        if (this.x - this.board.x <= 2 || this.x - this.board.x - this.board.w > -18 || this.y - this.board.y <= 2 || this.y - this.board.y - this.board.h > -18)
        {
            this.lost = true
            this.moving = false
        }
        
    }
    input_poll(event)
    {
        if(!this.board.running && !this.lost)
            return
        this.moving = true
        //print(event.key == "ArrowDown")
        if(event.key == "ArrowDown")
        {
            this.next_dir = 270
        }
        else if(event.key == "ArrowLeft")
        {
            this.next_dir = 180
        }
        else if(event.key == "ArrowRight")
        {
            this.next_dir = 0
        }
        else if(event.key == "ArrowUp")
        {
            this.next_dir = 90
        }
        //print(this.next_dir)
    }
}

apple_list = []

class Apple
{
    constructor(x,y)
    {
        this.x = x
        this.y = y
        apple_list.push(this)
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
    constructor(x,y,w,h)
    {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.bg_color = "white"
        this.draw = this.draw.bind(this);
        this.draw_pre = this.draw_pre.bind(this);
        this.draw_post = this.draw_post.bind(this);
        setInterval(this.draw,1000/60)
        this.running = true
        this.keys = new Map()
        this.startFrame = 0
        this.fps = 0
        this.doFPS = true
        
        this.key_press = this.key_press.bind(this);
        self.addEventListener("keydown", this.key_press, false);
        this.key_release = this.key_release.bind(this);
        self.addEventListener("keyup", this.key_release, false);
    }
    draw_pre()
    {
        //print("AAA")
        if(this.doFPS)
        {
            var current_time = performance.now()
            this.fps = (1000 / (current_time - this.startFrame))
            this.startFrame = current_time
        }
        ctx.save()
        var border = new Path2D()
        border.rect(this.x, this.y, this.w, this.h);
        ctx.clip(border);
        ctx.fillStyle = this.bg_color
        ctx.fillRect(this.x,this.y,this.w,this.h)
    } 
    draw()
    {
        this.draw_pre()
        this.draw_post()
    }
    draw_post()
    {
        ctx.lineWidth = 4
        ctx.strokeStyle = "black"
        ctx.strokeRect(this.x+1,this.y+1,this.w-2,this.h-2)
        ctx.restore()
        if(this.doFPS)
        {
            ctx.font = "30px sans-serif"
            ctx.fillStyle = "rgba(255,0,0,0.4)"
            ctx.fillText("FPS:"+String(floor(this.fps*10)/10),this.x+2,this.y+30)
        }
    }
    key_press(event)
    {
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
}

class SnakeBoard extends GameBoard
{
    constructor(x,y,w,h)
    {
        super(x,y,w,h)
        this.current_snake = null
        this.appleAmount = 1
    }
    draw()
    {
        if(!this.running)
            return
        super.draw_pre()
        const size = 40
        for(var i = 0; i < 22; i++)
        {
            for(var j = 0; j < 22; j++)
            {
                ctx.strokeStyle = "rgba(255,0,0,0.25)"
                ctx.strokeRect(2+this.x+size*i,2+this.y+size*j,size,size)
                ctx.strokeStyle = "rgba(128, 0, 0, 0.125)"
                ctx.strokeRect(-18+this.x+size*i,-18+this.y+size*j,size,size)
            }
        }
        if(this.appleAmount > apple_list.length)
        {
            new Apple(randInt(20+this.x,Math.floor((this.x+this.w)/20)*20-20,20), randInt(20+this.y,Math.floor((this.y+this.h)/20)*20-20,20))
        }
        if(this.current_snake == null)
        {
            this.current_snake = new Snake(this)
        }
        else
        {
            if(frameCount % 1 == 0)
            {
                if(((this.current_snake.x + this.x) % 20) == 2 && ((this.current_snake.y + this.y) % 20) == 2 && this.current_snake.moving)
                {
                    this.current_snake.turn()
                }
                this.current_snake.move()
            }
            this.current_snake.draw()
        }
        
        for(var i in apple_list)
        {
            apple_list[i].draw()
        }
        super.draw_post()
    }
    key_press(event)
    {
        if(super.key_press(event) == 1)
        {
            if(event.key == "Enter")
            {
                if(this.current_snake != null)
                {
                    if(this.current_snake.lost)
                    {
                        this.running = false
                        delete this.current_snake
                        for(var i in apple_list)
                        {
                            delete apple_list[i]
                        }
                        apple_list = []
                    }
                }
                this.running = !this.running
            }
        }
    }
}

let FPS_Show = false
let fps_counter = document.getElementById("FPS")
last_frame = performance.now()

function frame()
{
    frameCount++
    if(FPS_Show)
    {
        var current_time = performance.now()
        //current_time = (current_time.getMilliseconds() + current_time.getSeconds() * 1000 + current_time.getMinutes() * 1000 * 60)
        fps_counter.innerHTML = "FPS: " + String((current_time - last_frame))
        last_frame = performance.now()
        //last_frame = (last_frame.getMilliseconds() + last_frame.getSeconds() * 1000 + last_frame.getMinutes() * 1000 * 60)
    }
    //sname.draw()

}

sname = new SnakeBoard(0,0,400,400)

frame()

setInterval(frame,1000/60)