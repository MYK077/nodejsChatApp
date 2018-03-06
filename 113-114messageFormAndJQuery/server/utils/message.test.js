var expect = require('expect');

var {generateMessage}= require('./message');

describe('generatetest',()=>{
  it('should generate correct message object',()=>{
        var from = 'jan';
        var text = 'some message';
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message.from).toBe('jan');
        expect(message.text).toBe('some message');

  })
})
