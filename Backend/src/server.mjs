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
  cors: { origin: "http://localhost:3001", method: ["GET", "POST"] },
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

//  test

//!schema
//total balance
//total asset
//current rate
// highest rate
// lowest rate

//! rate changer function
//call this function when a client buy or sell asset using balance
//call this function when profit increased ()
// total && balance asset from db
// increment or decrement given balance, asset and rate
// save new balance asset or rate

//! dynamically rate change function

let highestNumber = 0;
let lowestNumber = 10;
let highestNumberArray = [];
let lowestNUmberArray = [];

function getTheLatestDBData() {
  // get all the data from db here, the random data will be replaced by rate from database
  let randomNumber = Math.random(); // current rate here

  if (randomNumber < lowestNumber) {
    lowestNumber = randomNumber;
    lowestNUmberArray.push(lowestNumber);
  }
  if (randomNumber > highestNumber) {
    highestNumber = randomNumber;
    highestNumberArray.push(highestNumber);
  }
  return {
    randomNumber: randomNumber,
    highestNumberArray: highestNumberArray,

    lowestNUmberArray: lowestNUmberArray,
  };
}

setInterval(() => {
  const storage = [];
  setInterval(() => {
    const result = getTheLatestDBData();
    storage.push(result); // Store the result
  }, 100); // Run myFunction() every millisecond

  setTimeout(() => {
    // update the fiveMinuteCandle Schema here
    console.log({
      lastNumber: storage[storage.length - 1].randomNumber,
      highestNumber:
        storage[storage.length - 1].highestNumberArray[
          highestNumberArray.length - 1
        ],
      lowestNumber:
        storage[storage.length - 1].lowestNUmberArray[
          lowestNUmberArray.length - 1
        ],
    }); // Log the storage
  }, 4999); // Return the storage after one second
}, 5000); // Run the outer setInterval every second

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
