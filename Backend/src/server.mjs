import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./DB/index.db.mjs";
import cors from "cors";
import calculatorRouter from "./routes/calculator.routes.mjs";
import { taskOneCalculation } from "./services/taskOne.services.mjs";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", method: ["GET", "POST"] },
});
dotenv.config({ path: "./.env" });

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.static("public"));
app.use("/api/v1/test", calculatorRouter);

const PORT = process.env.PORT;

io.on("connection", (socket) => {
  console.log(`User Connected ${socket.id}`);
  socket.on("send-message", (data) => {
    const { balance, asset } = data.balance;

    let secondsElapsed = 0;

    const intervalId = setInterval(() => {
      const result = taskOneCalculation(balance, asset);
      socket.emit("receives-numbers", { result });

      secondsElapsed++;
      if (secondsElapsed >= 5) {
        clearInterval(intervalId);
      }
    }, 1000);
  });

  // Function to send count data to the client
  let intervalId; // Declare intervalId outside of the functions
  let count = 0;
  let balance = 1000;
  const sendCountData = () => {
    intervalId = setInterval(() => {
      let calculation = balance / 500;

      socket.emit("balance-count", balance, calculation);
      if (count >= 4) {
        clearInterval(intervalId);
      } else {
        count++;
      }
    }, 1000);
  };

  sendCountData();

  socket.on("send-balance", (updatedCount) => {
    clearInterval(intervalId);

    balance = updatedCount;

    sendCountData(); // Resume sending count data every second
  });
});

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`server is listening to port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
  });
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode).json({ error: err.message, errors: err.errors });
});
