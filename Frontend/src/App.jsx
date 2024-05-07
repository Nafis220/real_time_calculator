import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io.connect("http://localhost:3000");
const App = () => {
  const [realTimeChange, setRealTimeChange] = useState({});
  const [fiveMinutesData, setFiveMinutesData] = useState([]);
  const [currentClick, setCurrentClick] = useState(Number);
  const [loading, setLoading] = useState(false);
  const watchCandle = (iteration) => {
    if (fiveMinutesData.length === 0) {
      // If fiveMinutesData is empty, fetch new data
      setFiveMinutesData([]);

      if (iteration === 50) {
        socket.emit("timeToWatch", 50);
        socket.on("100-ms-data", (data) => {
          setRealTimeChange(data);
        });
        socket.on("five-minute-data", (data) => {
          setFiveMinutesData([data.fiveMinutesData]); // No need for arrow function here
        });
      } else {
        socket.emit("timeToWatch", 100);
        socket.on("100-ms-data", (data) => {
          setRealTimeChange(data);
        });
        socket.on("five-minute-data", (data) => {
          setFiveMinutesData([data.fiveMinutesData]); // No need for arrow function here
        });
      }
    } else {
      // If data is already present, avoid making another request
      // Optionally, you can update the existing data instead of clearing it
      socket.off("100-ms-data");
      socket.off("five-minute-data");
      if (iteration === 50) {
        socket.emit("timeToWatch", 50);
        socket.on("100-ms-data", (data) => {
          setRealTimeChange(data);
        });
        socket.on("five-minute-data", (data) => {
          setFiveMinutesData([data.fiveMinutesData]); // No need for arrow function here
        });
      } else {
        socket.emit("timeToWatch", 100);
        socket.on("100-ms-data", (data) => {
          setRealTimeChange(data);
        });
        socket.on("five-minute-data", (data) => {
          setFiveMinutesData([data.fiveMinutesData]); // No need for arrow function here
        });
      }
    }
  };

  useEffect(() => {
    console.log(fiveMinutesData[0]);
    console.log(currentClick);
  }, [fiveMinutesData, currentClick]);

  return (
    <div className='root'>
      <button
        onClick={() => {
          watchCandle(50);
          setCurrentClick(50);
        }}
      >
        Watch Candle of 5 Seconds
      </button>{" "}
      <br />
      <button
        onClick={() => {
          watchCandle(100);
          setCurrentClick(100);
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 5000);
        }}
      >
        Watch Candle of 10 seconds
      </button>
      <h1>Get the Current Data</h1>
      <h2>Current Rate: {realTimeChange.result}</h2>
      <h3>Highest Rate:{realTimeChange.highestNumber}</h3>
      <h3>Lowest Rate: {realTimeChange.lowestNumber} </h3>
      <h1>Get the previous Five Mintes Data</h1>
      {fiveMinutesData.length > 0 &&
        fiveMinutesData.map((data, index) => (
          <div key={index}>
            {data.map((realData, idx) => (
              <div style={{ display: "flex", height: "100vh" }} key={idx}>
                {currentClick === 50 && realData.time === 50 && (
                  <div style={{ flex: 1, backgroundColor: "lightblue" }}>
                    <h1>{data.length}</h1>
                    <h2>Current Rate: {realData.currentRate}</h2>
                    <h2>Highest Rate: {realData.highestRate}</h2>
                    <h2>Lowest Rate: {realData.lowestRate}</h2>
                    <h2>Starting Price {realData.startingNumber} </h2>
                    <br />
                  </div>
                )}
                {currentClick === 100 && realData.time === 100 && (
                  <div style={{ flex: 1, backgroundColor: "lightblue" }}>
                    <h1>{data.length}</h1>
                    <h2>Current Rate: {realData.currentRate}</h2>
                    <h2>Highest Rate: {realData.highestRate}</h2>
                    <h2>Lowest Rate: {realData.lowestRate}</h2>
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
