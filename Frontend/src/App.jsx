import { useState } from "react";
import { io } from "socket.io-client";
const socket = io.connect("http://localhost:3000");
const App = () => {
  const [realTimeChange, setRealTimeChange] = useState({});
  const [fiveMinutesData, setFiveMinutesData] = useState([]);

  const watchCandle = (iteration) => {
    console.log(iteration);

    // If fiveMinutesData is empty, fetch new data
    setFiveMinutesData([]);

    if (iteration === 600) {
      socket.emit("timeToWatch", 600);
      socket.off("ten-minute-data");
      socket.on("100-ms-data", (data) => {
        setRealTimeChange(data);
      });
      socket.on("five-minute-data", (data) => {
        console.log(data);
        setFiveMinutesData([data.candleData]);
      });
    } else {
      socket.emit("timeToWatch", 1200);
      socket.off("five-minute-data");
      socket.on("100-ms-data", (data) => {
        setRealTimeChange(data);
      });
      socket.on("ten-minute-data", (data) => {
        console.log(data);
        setFiveMinutesData([data.candleData]); // No need for arrow function here
      });
    }
  };

  return (
    <div className='root'>
      <button
        onClick={() => {
          watchCandle(600);
        }}
      >
        Watch Candle of 5 Minutes
      </button>{" "}
      <br />
      <button
        onClick={() => {
          watchCandle(1200);
        }}
      >
        Watch Candle of 10 seconds
      </button>
      <h1>Get the Current Data</h1>
      <h2>Current Rate: {realTimeChange.result}</h2>
      <h3>Highest Rate:{realTimeChange.highestNumber}</h3>
      <h3>Lowest Rate: {realTimeChange.lowestNumber} </h3>
      <h3>Starting Price {realTimeChange.startingNumber} </h3>
      <h1>Get the previous Five Mintes Data</h1>
      {fiveMinutesData.length > 0 &&
        fiveMinutesData.map((data, index) => (
          <div key={index}>
            {data.map((realData, idx) => (
              <div style={{ display: "flex", height: "100vh" }} key={idx}>
                {realData.time === 600 && (
                  <div style={{ flex: 1, backgroundColor: "lightblue" }}>
                    <h1>{data.length}</h1>
                    <h2>Current Rate: {realData.currentRate}</h2>
                    <h2>Highest Rate: {realData.highestRate}</h2>
                    <h2>Lowest Rate: {realData.lowestRate}</h2>
                    <h2>Starting Price {realData.startingNumber} </h2>
                    <br />
                  </div>
                )}
                {realData.time === 1200 && (
                  <div style={{ flex: 1, backgroundColor: "lightblue" }}>
                    <h1>{data.length}</h1>
                    <h2>Current Rate: {realData.currentRate}</h2>
                    <h2>Highest Rate: {realData.highestRate}</h2>
                    <h2>Lowest Rate: {realData.lowestRate}</h2>
                    <h2>Starting Price {realData.startingNumber} </h2>
                    <br />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default App;
