// path is built in node module and need not be installed from npm,zero length path segments are ignored
const path = require('path');
const express = require('express');

// Socket.IO enables real-time bidirectional event-based communication.
// It works on every platform, browser or device, focusing equally on reliability and speed.
// Socket.io enables two way communication between the web server and the client i.e data will flow seamlessly
// from server to the browser and browser to the server
const socketIO = require('socket.io');
var publicPath = path.join(__dirname,'/../public');

// process.env.port is for heroku
const port =process.env.PORT || 3000;

const app = express();

// app.set('view engine', 'html');
// to serve the static files html, css files, images
app.use(express.static(publicPath));


console.log(publicPath);

// app.get("/home",(req,res)=>{
//   res.render('index')
// })

app.listen(port,()=>{
  console.log('server is up and running');
})
