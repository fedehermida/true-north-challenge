const express = require("express");
const events = require('./server/events')
const taskRoutes = require("./server/routes/taskRoutes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(taskRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err);
});

const server = app.listen(5050)

server.on('error', events.onServerError);
process.on('SIGINT', events.onProcessKill(server));
process.on('SIGTERM', events.onProcessKill(server));
process.on('unhandledRejection', events.onException);
process.on('uncaughtException',  events.onException);


module.exports = server;
