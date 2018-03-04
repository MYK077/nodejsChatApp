var socket = io();
// event names 'connect','disconnect' are names of built in events so the will only work if we type them correctly
socket.on('connect',function(){
  console.log('connected to the server');

// event will be emitted when we are connected:
socket.emit('createEmail',{
  from:'client@example.com',
  to:'tay@example.com',
  text:'hey this is tech ninja',
  createdAt:1233
});

socket.emit('createMessage',{
  to:'AD',
  text:'how are you?',
  createdAt:Date()
})

});

socket.on('disconnect',function(){
  console.log('disconnected from the server');
});
// event listener for new email
socket.on('newEmail',function(email){
  console.log('New Email',email);
});

// listening to newMessage event from the emitted from the server
socket.on('newMessage',function(message){
  console.log('newMessage',message);
})
