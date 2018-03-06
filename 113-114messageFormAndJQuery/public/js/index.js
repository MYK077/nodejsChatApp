var socket = io();
// event names 'connect','disconnect' are names of built in events so the will only work if we type them correctly
socket.on('connect',function(){
  console.log('connected to the server');

});

socket.on('disconnect',function(){
  console.log('disconnected from the server');
});

// listening to newMessage event emitted from the server
socket.on('newMessage',function(message){
  console.log('newMessage',message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}:${message.text}`);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit',function(e){
//prevent default will prevent the default behaviour(refresh the page) when submit event is fired i.e when send button clicked
    e.preventDefault();

    socket.emit('createMessage',{
      from:"User",
      text:jQuery('[name=message]').val()
    },function(){

    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click',function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser');
  }
  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit('createLocationMessage',{
      longitude: position.coords.latitude,
      latitude: position.coords.longitude
    })
},function(){
    alert('unable to fetch location.');
 });
});
