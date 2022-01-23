const { Server } = require('socket.io');
const io = new Server({
	cors: {
		origin: 'http://localhost:3000',
	},
});

io.on('connection', (socket) => {
	socket.on('room', (room, username) => {
		console.log('joining room');
		socket.join(room);
		// this is emitted to every socket connection in the room (besides the socket that emitted the event; for the 'joiner')
		socket.to(room).emit('newJoin', socket.id, username);

		// for every socket in a particular room, they will generate another 'data' object to send to the joining peer so that,
		// that peer can connect to the sending peers.
		// we do this because joining rooms will be less difficult as the joining peer won't have to know how many peers are already in the
		// room and generate a certain amount of 'data' objects.
		// for the peers already in a room.
		socket.on('data', (data, socketid) => {
			socket.to(socketid).emit('dataConnect', data, username);
		});
	});
	socket.on('disconnect', (reason) => {
		console.log('disconnecting');
	});
});
console.log('listening...');
io.listen(process.env.PORT);
