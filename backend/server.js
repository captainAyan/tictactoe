const express = require("express");
const http = require("node:http");
const mongoose = require("mongoose");
const path = require("node:path");
const { StatusCodes } = require("http-status-codes");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const { Server } = require("socket.io");

const { socketAuth } = require("./middlewares/authMiddleware");
const {
  errorHandler,
  ErrorResponse,
} = require("./middlewares/errorMiddleware");
const { onConnection, onDisconnection } = require("./util/userSocketsManager");

const PER_MINUTE_REQUEST_LIMIT = 100;

require("dotenv").config();

const port = process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your client URL
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = process.env.MONGODB_URI;
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(morgan("tiny"));

app.use(helmet());

app.use(cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: process.env.NODE_ENV === "production" ? PER_MINUTE_REQUEST_LIMIT : false,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    throw new ErrorResponse("Too many requests", StatusCodes.TOO_MANY_REQUESTS);
  },
});
app.use(limiter); // limits all paths

const notificationIO = io.of("/notification");
notificationIO.use(socketAuth);

notificationIO.on("connection", (socket) => {
  onConnection(socket);

  socket.on("disconnect", () => {
    onDisconnection(socket);
  });
});

app.use("/api", require("./routes/api"));

// Serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

app.use("*", (req, res, next) => {
  throw new ErrorResponse("Not found", StatusCodes.NOT_FOUND);
});

app.use(errorHandler);

server.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;
