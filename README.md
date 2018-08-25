# l8r [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

[![Greenkeeper badge](https://badges.greenkeeper.io/busterc/l8r.svg)](https://greenkeeper.io/)

> queue multiple functions and run later

__*Niceties*__
- widely compatible and small codebase

__*Caveats*__
- there is no built in mechanism to receive return values; use callbacks or promises
- any unhandled exception will stop subsequent function calls

## Installation

```sh
$ npm install --save l8r
```

## Example

```js
'use strict';

// let's queue socket listeners before we have a connection

var L8r = require('l8r');

var httpServer = require('http').createServer().listen(3000);
var io = require('socket.io')(httpServer);
var ioClient = require('socket.io-client')('http://localhost:3000');

// ...

// queue client-side listeners
var clientListeners = new L8r();

(function () {
  var self = {
    smile: '=)'
  };

  clientListeners.add(function (socket) {
    var smile = this.smile || self.smile;

    socket.on('smile', function (gesture) {
      var smiley = gesture || smile;
      console.log(smiley);

      if (smile === '=)') {
        socket.emit('wink');
      }
    });

    socket.on('smirk', function (gesture) {
      if (gesture === ';D' && smile === ':-)') {
        console.log(gesture);
        httpServer.close();
        ioClient.close();
      }
    });
  });
})();

// ...

// queue server-side listeners
var serverListeners = new L8r();

(function () {
  serverListeners.add(function (socket) {
    socket.once('wink', function () {
      socket.emit('smirk', ';D');
    });
  });
})();

// ...

// now that it's later, add listeners
serverListeners.run(ioClient);

// ...

io.on('connection', function (socket) {
  // now we that we have the connected socket, 
  // we can add listeners
  clientListeners.run(socket);

  // if you want to pass context to all the functions,
  // use "apply()" instead of "run()"
  clientListeners.apply({
    smile: ':-)'
  }, [socket]);

  ioClient.emit('smile');
  // => =)
  // => :-)
  // => ;D
});
```

## API

### add(fn)

- #### fn
  
    *Required*
    Type `Function`

    A function to be queued for calling later.

### run([arguments])

    Run all the functions added to the queue, passing in any arguments

- #### arguments

    Type: `Any`
    
    Parameters to pass into each function

### apply(context, [parameters])

    Run all the functions added to the queue, with context, 
    applying an array of parameters (if provided)

- #### context

    *Required*
    Type: `Object`

- #### parameters

    Type: `Array`

### queue

    The queue of functions to be called later

### q

    An alias for `queue`


## License

ISC © [Buster Collings](https://about.me/buster)


[npm-image]: https://badge.fury.io/js/l8r.svg
[npm-url]: https://npmjs.org/package/l8r
[travis-image]: https://travis-ci.org/busterc/l8r.svg?branch=master
[travis-url]: https://travis-ci.org/busterc/l8r
[daviddm-image]: https://david-dm.org/busterc/l8r.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/busterc/l8r
