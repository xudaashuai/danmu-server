var koa = require('koa');
var app = new koa();
var fs = require('fs');
var serve = require('koa-static');

// static file
app.use(serve(__dirname));

// hook socket.io
var server = require('http').createServer(app.callback());
var socketIO = require('socket.io')(server);


// 创建socket服务
// 房间用户名单
var roomInfo = {};
let i = 0;
socketIO.on('connection', function (socket) {
  i += 1;
  let roomId = socket.handshake.query.id;
  socket.user = {id: i}
  socket.join(roomId, () => {
    console.log(roomId)
    socket.to(roomId).emit('join', {'msg': '徐大帅进入了房间'})
  })
  socket.on('name', data => {
    console.log(data)
    socket.user.name=data
    socket.emit('login',{})
  })
  socket.on('message', data => {
    console.log(data)
    socket.to(roomId).emit('message', {msg: data.msg, user: socket.user.id})
  })
});


// listen
server.listen(3000);

