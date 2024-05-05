import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./DB/index.db.mjs";
import cors from "cors";
import calculatorRouter from "./routes/calculator.routes.mjs";
import FiveMinutesData from "./models/fiveMinute.model.mjs";
import getTheLatestDBData from "./services/getLatestData.services.mjs";
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

  // Define startInterval function

  const sendDatatoClientandDB = (iteration) => {
    let i = 1;
    let result = {};
    const intervalId = setInterval(async () => {
      if (i === iteration) {
        clearInterval(intervalId);
        sendDatatoClientandDB(iteration); // Start the interval again immediately
        //send to database
        try {
          await FiveMinutesData.create({
            time: iteration,
            currentRate: result.randomNumber,
            highestRate: result.highestNumberArray.at(-1),
            lowestRate: result.lowestNUmberArray.at(-1),
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        //check the change of balance of every 100ms from db
        result = getTheLatestDBData();

        // send every 100ms data to client using socket
        socket.emit("100-ms-data", {
          result: result.randomNumber,
          highestNumber: result.highestNumberArray.at(-1),
          lowestNumber: result.lowestNUmberArray.at(-1),
        });
        const fiveMinutesData = await FiveMinutesData.find({ time: iteration });
        socket.emit("five-minute-data", {
          fiveMinutesData,
        });
        i++;
      }
    }, 100);
  };

  socket.on("timeToWatch", (data) => {
    sendDatatoClientandDB(Number(data));
  });
});

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

app.post("/timeChecker", async (req, res) => {
  const { currentRate, highestRate, lowestRate } = req.body;
  await FiveMinutesData.create({
    currentRate: currentRate,
    highestRate: highestRate,
    lowestRate: lowestRate,
  });

  res.status(201).json("created");
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
