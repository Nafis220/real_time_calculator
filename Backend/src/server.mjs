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

  const sendDataToClient = async (iteration) => {
    try {
      const result = getTheLatestDBData();

      // Send data to the client using socket
      socket.emit("100-ms-data", {
        result: result.randomNumber,
        highestNumber: result.highestNumberArray.at(-1),
        lowestNumber: result.lowestNUmberArray.at(-1),
        startingNumber: result.startingNumberArray.at(0),
      });

      const fiveMinutesData = await FiveMinutesData.find({ time: iteration });

      // Send data to the client
      socket.emit("five-minute-data", {
        fiveMinutesData,
      });
      console.log("49");
    } catch (error) {
      console.log(error);
    }
  };

  const sendDataToDatabase = async (iteration) => {
    console.log(iteration);
    try {
      const result = getTheLatestDBData();

      // Send data to the database
      await FiveMinutesData.create({
        time: iteration,
        currentRate: result.randomNumber,
        highestRate: result.highestNumberArray.at(-1),
        lowestRate: result.lowestNUmberArray.at(-1),
        startingNumber: result.startingNumberArray.at(0),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const FiveMinutesendDatatoClientandDB = async (iteration) => {
    let i = 1;

    const intervalId = setInterval(async () => {
      if (i === iteration) {
        clearInterval(intervalId);

        sendDataToDatabase(iteration);
        FiveMinutesendDatatoClientandDB(iteration);
        //send to database
      } else {
        sendDataToClient(iteration);

        i++;
      }
    }, 500);
  };
  const TenMinutesendDatatoClientandDB = async (iteration) => {
    let i = 1;

    const intervalId = setInterval(async () => {
      if (i === iteration) {
        clearInterval(intervalId);

        await sendDataToDatabase(iteration);
        TenMinutesendDatatoClientandDB(iteration);
      } else {
        await sendDataToClient(iteration);
        i++;
      }
    }, 500);
  };

  socket.on("timeToWatch", (data) => {
    console.log(data, "107");
    if (data === 50) {
      FiveMinutesendDatatoClientandDB(Number(data));
    } else {
      TenMinutesendDatatoClientandDB(Number(data));
    }
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
