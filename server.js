require("./config/config");
require("./utils/commons");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const mongoose = require("mongoose");
const mongodbUri = require("mongodb-uri");
const http = require("http");

const formData = require("express-form-data");
const debug = require("debug")("pet-home:server");
const indexRouter = require("./routes");
const cors = require('cors');

const SocketService = require("./services/SocketService");

const app = express();
app.use(cors());
app.options('*', cors());
// Database config
const mongoLocation = require("./config/keys").mongoURI;
let mongooseUri = mongodbUri.formatMongoose(mongoLocation);

// Connect to MongoDB
mongoose
  .connect(
    mongooseUri,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

let db = mongoose.connection;

module.exports = db;
db.once("open", () => {
  console.log('Connected to mongo at ' + mongooseUri);
});
db.on("error", error => {
  console.log("error", error);
});

/**
 * Create HTTP server.
 */
const server = http.createServer(app);


// initial socket io
SocketService.configure(server);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static("client/build"));

app.get("/", (req, res) => {
res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

//Passport
app.use(passport.initialize());

//CORS
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, content-type, Authorization, Content-Type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(formData.parse());

app.use("/api", indexRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  next(err);
});

const port = normalizePort(process.env.PORT || "5000");
app.set("port", port);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
