var socket = io();

// creating function for autoscrolling
function scrollToBottom () {
//Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
//Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop    = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
//inner height takes into account the height of the new message including the padding
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(scrollTop + clientHeight + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

// event names 'connect','disconnect' are names of built in events so the will only work if we type them correctly
socket.on('connect',function(){
   var params = jQuery.deparam(window.location.search);
   socket.emit('join', params, function(err){
     if(err){
       alert(err);
       window.location.href = 'http://localhost:3000/';
     }else{
       console.log('no error');
     }
   });
});

socket.on('disconnect',function(){
  console.log('disconnected from the server');
});

// listening to newMessage event emitted from the server
socket.on('newMessage',function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
//implementing mustache.js rendering method, html() method will return the markup inside the message template
//which is the paragraph. <p>This is a template</p>
  var template = jQuery('#message-template').html();
//Mustache.render(template) takes the template you wanna render
  var html = Mustache.render(template,{
    text: message.text,
    from: message.from,
    createdAt:formattedTime
  });

  jQuery('#messages').append(html);
// adding autoscrolling function every time a new message is created
  scrollToBottom();

  });

  socket.on('newLocationMessage',function(locationDetails){
    var formattedTime = moment(locationDetails.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
      from:locationDetails.from,
      url:locationDetails.url,
      createdAt:formattedTime
    });
    jQuery('#messages').append(html);
// adding auto acrolling function every time new location is sent
    scrollToBottom();
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
