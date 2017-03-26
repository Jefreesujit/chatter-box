var user ="";
var socket = io();
var chatid = null;

$('#form1').submit(function(){
	user = $('#name').val();
	chatid = $('#chat-id').val();
	$('#form1').hide();
	$('.login-container').css('display', 'none');
	$('#form2').css('visibility', 'visible');
	socket.emit('username', {name:user , id:chatid});
	$("#sendername").html(user);
	return false;
});

$('#form2').submit(function(){
	var msg = $('#m').val();
	$('#messages').append($('<div>').html("<div class=\"username\">"+user+"</div><div class=\"usr-msg\">" + msg+"</div>").addClass("send-msg"));
	$('#messages').scrollTop($('#messages')[0].scrollHeight);
	socket.emit('chat-msg', {name:user, message:msg }  );
	$('#m').val('');
return false;
});

socket.on( 'msg-res' , function(data){
	$('#messages').append($('<div>').html("<div class=\"username\">"+data.name+"</div><div class=\"usr-msg\">"+ data.message+"</div>").addClass("receive-msg"));
	$('#messages').scrollTop($('#messages')[0].scrollHeight);
});

socket.on('join' , function(name){ 
	if( $('#form1').is(":hidden") && name != "" ) {
		$('#messages').append("<div class=\"notification\">"+ name+" joined the conversation </div>");
		$('#messages').scrollTop($('#messages')[0].scrollHeight);
	}
});

socket.on('exit' ,function(data){
	if( $('#form1').is(":hidden") && data != null ){
		$('#messages').append("<div class=\"notification\">"+ data +" left the conversation </div>");
		$('#messages').scrollTop($('#messages')[0].scrollHeight);
	}
});
