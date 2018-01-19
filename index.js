var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

// app.get('/sock-main.js', function(req,res){
// 	res.sendFile(__dirname + '/js/sock-main.js');
// });

app.get('/fonts/roboto/*', function(req,res){
	var fileName = req.url.substring(req.url.indexOf('Roboto'));
	res.sendFile(__dirname + '/fonts/roboto/' + fileName);
});

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/withdraw', function(req, res) {
  console.log(req.body);
  if (req.body.address && req.body.amount && parseFloat(req.body.amount) > 0.001) {
    res.status(200).json({
      status: 'Pending Verification',
      message: 'You request is being validated, once confirmed the payment will be processed. It will take around 3 - 7 working days to confirm and process the payment. \n Happy Mining!'
    });
  } else {
    res.status(400).json({
      status: 'Failed',
      message: 'Invalid request, please check the details'
    });
  }
});

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
});

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
