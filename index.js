var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
});

// app.get('/sock-main.js', function(req,res){
// 	res.sendFile(__dirname + '/js/sock-main.js');
// });

app.get('/fonts/roboto/*', function(req,res){
	var fileName = req.url.substring(req.url.indexOf('Roboto'));
	res.sendFile(__dirname + '/fonts/roboto/' + fileName);
});

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));

io.on('connection' , function(socket){

	socket.on('username', function(data){
		socket.getname = data.name;
		socket.chatroom = data.id;
		socket.join(data.id);
		console.log("user connected : "+ data.name );
		console.log("Room connected : "+ data.id );
		socket.broadcast.to(socket.chatroom).emit('join', data.name);
  	});

	socket.on('chat-msg', function(data){
    	console.log('message: ' + data.message);
    	socket.broadcast.to(socket.chatroom).emit('msg-res', data);
  	});
  	
	socket.on('disconnect' , function(){
		var name = socket.getname;
		socket.broadcast.to(socket.chatroom).emit('exit', name);
		console.log("user disconnected " + name);
	});
});

http.listen(process.env.PORT || 3000, function(){
	console.log("listening on port " + http.address().port);
});