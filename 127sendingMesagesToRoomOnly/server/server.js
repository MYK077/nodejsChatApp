// path is built-in node module and need not be installed from npm,zero length path segments are ignored
const path = require('path');
const express = require('express');
const app = express();
var {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
// pulling of the users property  which we exported from users.js
const {Users} =   require('./utils/users');
var users = new Users();

// to use the http server and client one must require http
const http = require('http');
// Socket.IO enables real-time bidirectional event-based communication.
// It works on every platform, browser or device, focusing equally on reliability and speed.
// Socket.io enables two way communication between the web server and the client i.e data will flow seamlessly
// from server to the browser and browser to the server
const socketIO = require('socket.io');
var publicPath = path.join(__dirname,'/../public');

// process.env.port is for heroku
const port = process.env.PORT || 3000;
// now our app is running on http server instead on express server
const server = http.createServer(app);
//now we want to configure the server to use socketIO
// we get back websocket server IO
var io = socketIO(server);

app.use(express.static(publicPath));
// io.on lets us register an event listener and so something when that event happens
// here we are using an event 'connection' that listen for a new connection and let us do something when that connection
// happens,io.on on method used for connection event , would not be usually used or called for other events
io.on('connection',(socket)=>{
  console.log("new user connected");

  socket.on('join',(params,callback)=>{
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('name and room name are required')
    }

    socket.join(params.room);
    // socket.leave('the office fans')

    // io.emit-->io.to('the office fans').emit
    // socket.broadcast.emit-->socket.broadcast.to('the office fans')
    // socket.emit
    //calling generateMessage function from message.js

    // removes user and returns it
    users.removeUser(socket.id);
    // add a user
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList',users.getUserList(params.room));

    socket.emit('newMessage',generateMessage('Admin','welcome to the chat app'));

    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));

    callback();
  });

// listening new message event emitted from client
  socket.on('createMessage',(message,callback)=>{
    var user = users.getUser(socket.id);

    if(user && isRealString(message.text)){
      io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
    }
// //io.emit is used to emit or broadcast the message to all the users, while socket.emit is used to broadcast it to a single
// //user, here every single user(including the user sending the message) will get the message from the current sending it.

    callback();
});

  socket.on('createLocationMessage',(coordinate)=>{
    var user = users.getUser(socket.id);
    io.to(user.room).emit('newLocationMessage',generateLocationMessage(`${user.name}`,coordinate.latitude , coordinate.longitude));
});

  socket.on('disconnect',()=>{
    var user = users.removeUser(socket.id);

    if (user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
    }
  });
});

server.listen(port,()=>{
  console.log('server is up and running');
})
