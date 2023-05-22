var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


//ajouté
var mongoose = require("mongoose");
var mongoConfig = require("./config/mongoConfig.json");
const http = require("http");
const bodyParser = require('body-parser');
var msgRoutes = require("./routes/messageRoutes");
const Msg = require('./models/messageModel');


var app = express();
app.use(express.json());


mongoose.connect(mongoConfig.uri,{ 
  useNewUrlParser: true ,
  useUnifiedTopology: true
  }).then(()=>{
      console.log("DB connected");
  }).catch(err=>{
      console.log(err);
  })

const server = http.createServer(app); 
server.listen(3000, ()=> console.log("server is run"));
const io = require("socket.io")(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/msg', msgRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//*
let num_users_online = 0;

io.on("connection", function(socket) {
  console.log ("User Connected..");

  //*
  //let the clients know how many online users are there:
  io.emit('updateNumUsersOnline', ++num_users_online);

  //socket.emit("msg","a new user joined the chat");
  socket.broadcast.emit('msg', 'A new user has joined the chat');

  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('userDisconnected', 'A user has left the chat');
    //*
    io.emit('updateNumUsersOnline', --num_users_online);
  });


  socket.on("msg",(data)=>{
    io.emit("msg",data)
 })


 socket.on('msg', (x,y) => {
  const message = new Msg({ 
      pseudo:x,
      content:y });
  message.save().then(() => {
      io.emit('message', y);
  })
})

// socket.on('typing', data => {
//   socket.broadcast.emit('typing', data);
// });


//each socket is unique to each client that connects:
//console.log("socket.id: " + socket.id);


socket.on('typing', (usr) => {
  socket.broadcast.emit('notification',usr);
});
});









// //socket.io:
// io.on('connection', function (socket) {

//   socket.on('username', function (username_from_client) {
//     socket.username = username_from_client;

//     //let all users know that this user has connected:
//     io.emit('userConnected', socket.username);
//   });

//   //handle adding a message to the chat.
//   socket.on('addChatMessage(client->server)', function (msg) {
//     //io.emit(..., ...); - sending the message to all of the sockets.
//     io.emit('addChatMessage(server->clients)', [socket.username, prepareMessageToClients(socket, msg)]);
//   });

//   //handle isTyping feature
//   //istyping - key down
//   socket.on('userIsTypingKeyDown(client->server)', function (undefined) {
//     io.emit('userIsTypingKeyDown(server->clients)', [socket.username, prepareIsTypingToClients(socket)]);
//   });

//   //istyping - key up
//   socket.on('userIsTypingKeyUp(client->server)', function (undefined) {
//     io.emit('userIsTypingKeyUp(server->clients)', socket.username);
//   });

// });



// // -------------------------------------------------
// function getParsedTime() {
//   const date = new Date();

//   let hour = date.getHours();
//   hour = (hour < 10 ? "0" : "") + hour;

//   let min = date.getMinutes();
//   min = (min < 10 ? "0" : "") + min;

//   return (hour + ":" + min);
// }

// // Prepare the message that will be sent to all of the clients
// function prepareMessageToClients(socket, msg) {
//   return ('<li>' + getParsedTime() + ' <strong>' + socket.username + '</strong>: ' + msg + '</li>');
// }

// //prepare the '___ is typing...' message
// function prepareIsTypingToClients(socket) {
//   return ('<li><strong>' + socket.username + '</strong> is typing...</li>')
// }


module.exports = app;
