// path is built-in node module and need not be installed from npm,zero length path segments are ignored
const path = require('path');
const express = require('express');
const app = express();

// to use the http server and client one must require http
const http = require('http');
// Socket.IO enables real-time bidirectional event-based communication.
// It works on every platform, browser or device, focusing equally on reliability and speed.
// Socket.io enables two way communication between the web server and the client i.e data will flow seamlessly
// from server to the browser and browser to the server
const socketIO = require('socket.io');
var publicPath = path.join(__dirname,'/../public')

// process.env.port is for heroku
const port = process.env.PORT || 3000;
// now our app is running on http server instead on express server
const server = http.createServer(app);
//now we want to configure the server to use socketIO
// we get back websocket server IO
var io = socketIO(server)

// io.on lets us register an event listener and so something when that event happens
// here we are using an event 'connection' that listen for a new connection and let us do something when that connection
// happens,io.on on method used for connection event , would not be usually used or called for other events
io.on('connection',(socket)=>{
  console.log("new user connected");

//since this is not a listener we donot want to specify a callback function but we would specify the data
// as we are emmiting an event here
  socket.emit('newEmail',{
    from:'myk@example.com',
    text:'hey techie ninja wats up',
    createdAt:123
  });

  socket.on('createEmail',(email)=>{
    console.log('createEmail',email);
  })
// emiting new message event
  socket.emit('newMessage',{
    from:'AD',
    text:'hey wats up myk',
    createdAt:Date()
  });

// listening new message event emitted from client
  socket.on('createMessage',(message)=>{
    console.log('createMessage',message);
  });

  socket.on('disconnect',(socket)=>{
    console.log("user disconnected");
  })
});

// to serve the static files html, css files, images
app.use(express.static(publicPath));

console.log(publicPath);

server.listen(port,()=>{
  console.log('server is up and running');
})
