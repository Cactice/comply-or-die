const
    io = require("socket.io"),
    server = io.listen(8000);

var redis = require("redis"),
client = redis.createClient({host:"redis-container"})


let sequenceNumberByClient = new Map();
let masterMap = new Map();


// event fired every time a new client connects:
server.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    // initialize this client's sequence number
    sequenceNumberByClient.set(socket, 1);
    console.info(socket.request.headers.cookie)
    const player_id = socket.id
    socket.on('start', function(msg){
      masterMap.set(socket, 1);
    });
    socket.on('chat', function(msg){
      console.log(msg)
      server.emit('chat',msg)
      serveMaster('chat', msg)
    });
    socket.on('showOptions', function(msg){
      let msgObj = JSON.parse(msg)
      client.set('answer_'+msgObj.answer,msgObj.answer,redis.print)
      delete msgObj.answer;

      server.emit('showOptions', msg);
    });
    socket.on('guessOption', function(msg){
      console.log(msg)
      let msgObj = JSON.parse(msg)
      msgObj.player_id = player_id
      msg = JSON.stringify(msgObj)
      serveMaster('guessOption',msg)
      // let msgObj = JSON.parse(msg)
      // client.getAsync('answer_'+msgObj.option).then(function(res) {
      //   const answer = res
      //   if(msgObj.key==answer){
      //     client.incr('points'+player_id,redis.print)
      //   }
      // })
    });
    socket.on('answerOptions', function(msg){
      server.emit('answerOptions', msg);
    });
    socket.on('endCinema', function(msg){
      socket.emit('endCinema', Points)
    });

    // when socket disconnects, remove it from the list:
    socket.on("disconnect", () => {
        sequenceNumberByClient.delete(socket);
        masterMap.delete(socket);
        console.info(`Client gone [id=${socket.id}]`);
    });
});


serveMaster = (key,msg) => {
    for (const [master] of masterMap.entries()) {
        master.emit(key, msg);
    }
}




// sends each client its current sequence number
// setInterval(() => {
//     for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
//         client.emit("seq-num", sequenceNumber);
//         sequenceNumberByClient.set(client, sequenceNumber + 1);
//     }
// }, 1000);