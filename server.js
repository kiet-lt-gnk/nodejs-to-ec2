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

mongoose
  .connect(`mongodb+srv://lamtuankiet0901:CBq571giQE96Cw2K@cluster0.l0zlbdb.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  //send and get message
  socket.on("sendMessage", async ({ receiverId, phone, amout, total, productID, position }) => {

    console.log(receiverId);
    try {
      const newTran = new Transaction({
        amout, productID, phone, total
      })

      await newTran.save()


      console.log("Connect MQTT");


      console.log("Connect MQTT DONE");


      io.to(receiverId).emit("getMessage", {
        message: "DONE",
      })
    } catch (error) {
      console.log(error);
      io.to(receiverId).emit("getMessage", {
        message: "FAIL",
      })
    }

  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});
http.listen(4000, () => {
  console.log('listening on *:4000');
});
// routes
app.use('/api', require('./app/routes/product.routes'))

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
