var socket = io();
// event names 'connect','disconnect' are names of built in events so the will only work if we type them correctly
socket.on('connect',function(){
  console.log('connected to the server');

});

socket.on('disconnect',function(){
  console.log('disconnected from the server');
});

// listening to newMessage event from the emitted from the server
socket.on('newMessage',function(message){
  console.log('newMessage',message);
})

socket.emit('createMessage',{
  from:"franky",
  text:"hi"
},function(data){console.log('ackowledgement',data)});

jQuery('#message-form').on('submit',function(e){
//prevent default will prevent the default behaviour(refresh the page) when submit event is fired i.e when send button clciked
    e.preventDefault();

    socket.emit('createMessage',{
      from:"User",
      text:jQuery('[name=message]').val()
    },function(){

    });
});
