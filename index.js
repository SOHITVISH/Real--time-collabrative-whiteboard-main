let express=require('express');
let app=express();
let httpServer=require('http').createServer(app);
let io=require('socket.io')(httpServer)

//We will maintain an array of connections
let connections=[];

io.on("connect",(socket)=>{

    //Adding the new connection to the connections array.
    connections.push(socket);
    console.log(`${socket.id} has connected`);

    //broadcast all the data (x and y coordinates to all other clients) using their socket id's.
    socket.on('draw',(data)=>{
        connections.forEach(con=>{
            if(con.id!==socket.id)
            {
                con.emit('ondraw',{x:data.x,y:data.y});
            }
        });
    });

//Makes the whiteboard real time by tracing the path on all other socket id's.
socket.on('down',(data)=>{
    connections.forEach(con=>{
        if(con.id!==socket.id){
            con.emit("ondown",{x:data.x,y:data.y});
        }
    })

})
    socket.on("disconnect",(reason)=>{
        console.log(`${socket.id} is disconnected`);
        connections=connections.filter(con=>con.id!==socket.id);
    });
});

//This is used to server static files in a directory named public. We will have all the front-end part for this program in the public directory
app.use(express.static("public"));
//process.env.PORT specifies the value set in the environment variable port.If there is nothing then it is set to 8080.
let PORT=process.env.PORT || 8080;
httpServer.listen(PORT,()=>console.log(`Server started on ${PORT}`));
