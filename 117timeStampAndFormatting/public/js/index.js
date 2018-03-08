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
  var formattedTime = moment(message.createdAt).format('h:mm a');
  console.log(formattedTime);
  console.log('newMessage',message);
  var li = jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);
  jQuery('#messages').append(li);

  });

  socket.on('newLocationMessage',function(locationDetails){
    var formattedTime = moment(locationDetails.createdAt).format('h:mm a');
     var li = jQuery('<li></li>');
     //using target = _blank opens the url in new tab
     var a  = jQuery('<a target ="_blank"> My Location Details </a>');
     // we are using methods like attr and text to insert values for security reasons otherwise people might
     // insert malacious values or content using console.
     li.text(`${locationDetails.from} ${formattedTime}:`);
     a.attr('href',locationDetails.url);
     li.append(a);
     jQuery('#messages').append(li);

  });

jQuery('#message-form').on('submit',function(e){
//prevent default will prevent the default behaviour(refresh the page) when submit event is fired i.e when send button clicked
    e.preventDefault();

    socket.emit('createMessage',{
      from:"User",
      text:jQuery('[name=message]').val()
    },function(){
        jQuery('[name=message]').val('')
    });
});

socket.on('newLocationMessage',(locationMessage)=>{
  console.log('locationMessage',locationMessage);
})

var locationButton = jQuery('#send-location');
locationButton.on('click',function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser');
  }
  // after clicking disable the location button
  locationButton.attr('disabled','disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage',{
      longitude: position.coords.latitude,
      latitude: position.coords.longitude
    })
},function(){
    locationButton.removeAttr('disabled').text('Send Location');
    alert('unable to fetch location.');
 });

});
