const app = require('./index');
var http = require('http').Server(app);
var io = require('socket.io')(http);

const server = app.listen(3000, () => {
    console.log(`Express is running on port ${server.address().port}`);
});

io.on('connection', function(socket){
  console.log('a user connected');
});