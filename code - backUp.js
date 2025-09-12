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

let current_snake = null

class Snake
{
    constructor(){
        this.x = 42
        this.y = 42
        this.moving = false
        this.tail_array = [floor(this.x/20),floor(this.y/20), 0]
        this.direction = 0
        this.speed = 5
        this.next_dir = 0
        for(var i = 1; i < 3; i++)
        {
            this.tail_array.push([floor((this.x)/20)-i,floor(this.y/20)], 0)
        }
        this.input_poll = this.input_poll.bind(this);
        self.addEventListener("keydown", this.input_poll, false);
    }
    draw()
    {
        ctx.beginPath();
        ctx.lineWidth = 5
        ctx.strokeStyle = "green"
        ctx.lineTo(this.x,this.y)
        for(var i = 1; i < this.tail_array.length; i++)
        {
            if(i + 1 < this.tail_array.length)
                ctx.lineTo(this.tail_array[i][0]*20+2, this.tail_array[i][1]*20+2)
            else
            {
                //print(this.direction)
                if(this.direction % 180 == 90)
                {
                    var lol = (this.y - (floor(this.y/20) - Math.sin(convert(this.direction)))*20)
                    if(lol > 20)
                        lol -= 40
                    ctx.lineTo(this.tail_array[i][0]*20+2 + Math.cos(convert(this.tail_array[i][2]))*lol, this.tail_array[i][1]*20+2 - Math.sin(convert(this.tail_array[i][2]))*lol)
                }
                else if(this.direction == 90)
                {
                    var lol = 20 - modulo(this.y, 20)
                    //print(this.tail_array[i][2])
                    ctx.lineTo(this.tail_array[i][0]*20+2 - Math.cos(convert(this.tail_array[i][2]))*lol, this.tail_array[i][1]*20+2 + Math.sin(convert(this.tail_array[i][2]))*lol)
                }
                else
                {
                    var lol = (this.x % 20)
                    //print(this.tail_array[i][2])
                    ctx.lineTo(this.tail_array[i][0]*20+2 + Math.cos(convert(this.tail_array[i][2]))*lol, this.tail_array[i][1]*20+2 - Math.sin(convert(this.tail_array[i][2]))*lol)
                }
            }
        }
        //print(this.tail_array)
        ctx.stroke();
    }
    move()
    {
        if(this.moving)
        {
            
            this.x += Math.cos(convert(this.direction))*this.speed
            this.y -= Math.sin(convert(this.direction))*this.speed
            this.tail_array[0] = [floor(this.x/20),floor(this.y/20), this.direction]
        }
    }
    turn()
    {
        for(var i = this.tail_array.length-1; i > 0; i--)
        {
            this.tail_array[i] = this.tail_array[i-1]
        }
        //print(this.next_dir)
        if(modulo(this.next_dir-180, 360) != this.direction)
            this.direction = this.next_dir
    }
    input_poll(event)
    {
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

function frame()
{
    frameCount++

    ctx.fill = "white"
    ctx.fillRect(0,0,canvas.width,canvas.height)
    const size = 40
    for(i = 0; i < 20; i++)
    {
        for(j = 0; j < 20; j++)
        {
            ctx.strokeStyle = "rgba(255,0,0,0.25)"
            ctx.strokeRect(2+size*i,2+size*j,size,size)
            ctx.strokeStyle = "rgba(128, 0, 0, 0.125)"
            ctx.strokeRect(-18+size*i,-18+size*j,size,size)
        }
    }
    
    if(current_snake == null)
    {
        current_snake = new Snake()
    }
    else
    {
        if(frameCount % 1 == 0)
        {
            current_snake.move()
            if((current_snake.x % 20) == 2 && (current_snake.y % 20) == 2 && current_snake.moving)
            {
                current_snake.turn()
            }
        }
        current_snake.draw()
    }

    ctx.lineWidth = 4
    ctx.strokeStyle = "black"
    ctx.strokeRect(1,1,canvas.width-2,canvas.height-2)
}

frame()

setInterval(frame,1000/60*5)