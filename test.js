'use strict';

var httpServer = require('http').createServer();
var test = require('tap').test;
var io = require('socket.io')(httpServer);
var ioc = require('socket.io-client')('http://localhost:3000');

var L8r = require('./index');

// cache the client socket after connection
var ioClient;

test('setup services for testing', t => {
  t.plan(3);

  ioc.on('connected', () => {
    t.pass();
  });

  io.on('connection', client => {
    ioClient = client;
    ioClient.emit('connected', 'hello');
    t.pass();
  });

  httpServer.listen(3000, () => {
    t.pass();
  });
}).then(() => {
  return test('"run()" functions', t => {
    t.plan(2);

    var clientl8r = new L8r();

    clientl8r.add(function (socket) {
      socket.on('yo', function (data) {
        t.pass();
        data = `${data} <- has been yoyo'd`;
        socket.emit('yoyo', data);
      });
    });

    clientl8r.run(ioClient);

    var serverl8r = new L8r();

    serverl8r.add(function (socket) {
      socket.on('yoyo', function (data) {
        if (data !== `wut <- has been yoyo'd`) {
          t.fail();
        }
        t.pass();
      });
    });

    serverl8r.run(ioc);

    ioc.emit('yo', 'wut');
  });
}).then(() => {
  httpServer.close();
  ioc.close();
}).then(() => {
  return test('"apply()" functions', t => {
    t.plan(2);

    var l8r = new L8r();

    var Somebody = function () {
      this.emotion = ':)';

      l8r.add(function () {
        if (this.emotion === ':)') {
          t.pass();
        }
      });
    };

    l8r.add(function () {
      if (this.emotion === ':(') {
        return t.pass();
      }
    });

    var somebody = new Somebody();
    l8r.apply(somebody);

    l8r.apply({
      emotion: ':('
    });
  });
});
