const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const mongoose = require('mongoose')
const http = require('http').createServer(express);
const io = require('socket.io')(http, {
  cors: {
    origin: "*"
  }
});

const Transaction = require('./app/models/transaction.model')

const mqtt = require("mqtt");
const logger = require("./logger");
const client = mqtt.connect([{ host: 'tcp://0.tcp.ap.ngrok.io', port: 14374 }]);

client.on("connect", () => {
  client.subscribe("001", (err) => {
    if (!err) {
      console.log("Position");

      client.publish("001", "1");
    }

    console.log(err);
  });
});

const app = express();

//app.use(cors());
/* for Angular Client (withCredentials) */
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true
  })
);
// simple route
app.get("/", (req, res) => {
  logger.warning("Hello, Winston!");
  logger.info("127.0.0.1 - there's no place like home");
  logger.error("Events Error: Unauthenticated user");
  res.json({ message: "Welcome to bezkoder application." });
});
// routes
app.use('/api', require('./app/routes/product.routes'))

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
