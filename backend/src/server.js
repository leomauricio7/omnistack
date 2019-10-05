const express = require("express");
const monggose = require("mongoose");
const cors = require("cors");
const path = require("path");

const socketio = require("socket.io");
const http = require("http");

//importando as rotas
const routes = require("./routes");

const app = express();
const server = http.Server(app);
const io = socketio(server);

//conexão com o banco de dados
monggose.connect(
  "mongodb+srv://omnistack:omnistack@omnistack-47oup.mongodb.net/semana09?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const connectedUsers = {};

io.on("connection", socket => {
  const { user_id } = socket.handshake.query;
  connectedUsers[user_id] = socket.id;
  console.log(connectedUsers);
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  return next();
});

//habilita o acesso do CORS
app.use(cors());
//informa que o serve pode recebe requisições json
app.use(express.json());
//faz um apontamento do endereço das imagens em uma rota virtual
app.use("/files", express.static(path.resolve(__dirname, "..", "uploads")));
//importa as rotas
app.use(routes);
//porta onde está o rodando o server
server.listen(3000, () => {
  console.log("server rodando na porta 3000");
});
