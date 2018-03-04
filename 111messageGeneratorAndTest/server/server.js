// path is built-in node module and need not be installed from npm,zero length path segments are ignored
const path = require('path');
const express = require('express');
const app = express();
var {generateMessage} = require('./utils/message');
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

//calling generateMessage function from message.js
  socket.emit('newMessage',generateMessage('Admin','welcome to the chat app'));

  socket.broadcast.emit('newMessage',generateMessage('Admin','new user joined'));

// listening new message event emitted from client
  socket.on('createMessage',(message)=>{

// //io.emit is used to emit or broadcast the message to all the users, while socket.emit is used to broadcast it to a single
// //user, here every single user(including the user sending the message) will get the message from the current sending it.
  io.emit('newMessage',generateMessage(message.from,message.text));
//socket.broadcast.emit will send the message to all the connected users excluding the one who is seding it
  // socket.broadcast.emit('newMessage',{
  //   from:message.from,
  //   text:message.text,
  //   createAt:new Date().getTime()
  // });

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
