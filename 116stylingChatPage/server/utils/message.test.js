var expect = require('expect');

var {generateMessage,generateLocationMessage}= require('./message');

describe('generateMessage',()=>{
  it('should generate correct message object',()=>{
        var from = 'jan';
        var text = 'some message';
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message.from).toBe('jan');
        expect(message.text).toBe('some message');

  });
});

describe('generateLocationMessage',()=>{
  it('should generate Location message',()=>{
    var from = "julie";
    var latitude = 40.7608;
    var longitude = 111.8910;
    var location = generateLocationMessage(from,latitude,longitude);
    expect(location.createdAt).toBeA('number');
    expect(location).toInclude({
      from:"julie",
      url:"https://www.google.com/maps/search/"+latitude+"+"+longitude
    })
  })
})
