import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io.connect("http://localhost:3000");
const App = () => {
  const [realTimeChange, setRealTimeChange] = useState({});
  const [fiveMinutesData, setFiveMinutesData] = useState([]);
  useEffect(() => {
    socket.on("100-ms-data", (data) => {
      setRealTimeChange(data);
    });
  }, []);

  useEffect(() => {
    socket.on("five-minute-data", (data) => {
      setFiveMinutesData(() => [data.fiveMinutesData]);
    });
  }, [fiveMinutesData]);
  useEffect(() => {
    fiveMinutesData.map((data) => {
      data.map((realData) => {
        console.log(realData.currentRate);
      });
    });
  }, [fiveMinutesData]);
  return (
    <div className='root'>
      <h1>Get the Current Data</h1>
      <h2>Current Rate: {realTimeChange.result}</h2>
      <h3>Highest Rate:{realTimeChange.highestNumber}</h3>
      <h3>Lowest Rate: {realTimeChange.lowestNumber} </h3>
      <h1>Get the previous Five Mintes Data</h1>
      {fiveMinutesData.map((data, index) => (
        <div key={index}>
          {data.map((realData, idx) => (
            <div key={idx}>
              <br />
              <h2>Current Rate: {realData.currentRate}</h2>
              <h2>Highest Rate: {realData.highestRate}</h2>
              <h2>Lowest Rate: {realData.lowestRate}</h2>
              <br />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;
