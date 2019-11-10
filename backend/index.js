var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var redis = require("redis"),
client = redis.createClient({host:"redis-container"})
client.on("error", function (err) {
    console.log("Error " + err);
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.info(`Client connected [id=${socket.id}]`);
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('changeState', function(msg){
    io.emit('changeState', msg);
  });
  socket.on('answer', function(msg){
    io.emit('changeState', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});