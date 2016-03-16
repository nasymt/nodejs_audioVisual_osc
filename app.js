var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	//fs = require('fs'),
	osc = require('node-osc');
		
app.get('/',function(req,res){
	res.sendfile('index.html');
});
app.use(express.static('public'));
http.listen(3000,function(){
	console.log('listening on *:3000');
});

var CLIENT_NUM = 3;
var val = new Array(CLIENT_NUM);
//-------OSC Setup-------
var oscClient = new osc.Client("127.0.0.1",8000);
var oscServer = new osc.Server(8001,"0.0.0.0");

//--------Socket.io Setup---------
/*function handler(req,res){
	fs.readFile('./index.html',function(err,data){
		if(err){
			res.writeHead(500);
			return res.end('Error');
		}
		res.writeHead(200);
		res.write(data);
		res.end();
	});
}*/

//----------Socket.io--------------
io.sockets.on('connection', function(socket){	
	socket.on('joinRoom' , function(data){
		socket.join(data);
		console.log("あなたは"+data+"です");
	});
	setInterval(function(){
		if(flag>0){
			socket.to("client1").emit('draw',val[0]);
			socket.to("client2").emit('draw' , val[1]);
			socket.to("client3").emit('draw' , val[2]);
		}
	},50);
});

var flag=0;
var n=0;
//----------OSC Receive-------------
oscServer.on('message',function(msg){
	if(flag==0)flag=1;
	for(var i=0;i<CLIENT_NUM;i++){
		val[i] = msg[i+1];
	}
});