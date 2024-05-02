import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
const socket = io.connect("http://localhost:3000");
const App = () => {
  const [balance, setBalance] = useState({ balance: 0, asset: 0 });
  const [balanceReceive, setbalanceReceive] = useState([]);
  const [stopReceiving, setStopReceiving] = useState(false); // State to control receiving
  const balanceRef = useRef({ balance: 0, asset: 0 }); // Ref to hold the latest balance

  const stopReceivingNumbers = () => {
    setStopReceiving(true);
    console.log("click", stopReceiving);
  };

  const sendNumber = () => {
    socket.emit("send-message", { balance });
  };

  useEffect(() => {
    socket.on("receives-numbers", (data) => {
      if (!stopReceiving) {
        setbalanceReceive((prevNumbers) => [...prevNumbers, data.result]); // Add the received number to the array
        balanceRef.current = balance; // Update the balanceRef with the latest balance
      }
    });
  }, []);
  useEffect(() => {
    console.log(balanceReceive);
  });
  return (
    <div>
      <input
        type='number'
        name='balance'
        onChange={(event) =>
          setBalance((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
          }))
        }
      />
      <input
        name='asset'
        type='number'
        onChange={(event) =>
          setBalance((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
          }))
        }
      />

      <button onClick={sendNumber}>Send Number</button>

      <h2>Balance we get</h2>

      <button onClick={stopReceivingNumbers}>Stop</button>
      {balanceReceive.map((number, index) => (
        <h3 key={index}>{number}</h3> // Render received numbers
      ))}
    </div>
  );
};

export default App;
