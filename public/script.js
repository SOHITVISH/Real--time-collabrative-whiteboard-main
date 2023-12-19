//Getting the canvas object present in the html page
let canvas=document.querySelector("canvas");

//These two lines cover the entire dimension of the screen
canvas.width=0.98*window.innerWidth;
canvas.height=window.innerHeight;

//End point of the backend part. Through this link a new user connects to the session.
//http://localhost:8080/
var io=io.connect("http://localhost:8080/");

//Getting the contents of the canvas
let ctx=canvas.getContext("2d");

let x;
let y;

//Intially the mouse is not clicked or pressed.
let mouseDown=false; 

//When the mouse is clicked or pressed we run the following function. 
window.onmousedown=(e)=>{
    ctx.moveTo(x,y);
    io.emit('down',{x,y});
    mouseDown=true;
}

//When the mouse is not clicked or pressed.
window.onmouseup = (e)=>{
    mouseDown=false;
}



io.on('ondraw',({x,y})=>{
    ctx.lineTo(x,y);
    ctx.stroke();
});

io.on('ondown',({x,y})=>{
    ctx.moveTo(x,y);
})



window.onmousemove =(e)=>{
    x=e.clientX;
    y=e.clientY;
    //Only when the mouse is pressed or clicked we draw a stroke on the screen.
    if(mouseDown){ 
        io.emit('draw',{x,y});
        ctx.lineTo(x,y);
        ctx.stroke();
    }
}