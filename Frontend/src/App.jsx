import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
const socket = io.connect("http://localhost:3000");
const App = () => {
  const [balance, setBalance] = useState({ balance: 0, asset: 0 });
  const [balanceReceive, setbalanceReceive] = useState([]);
  const [stopReceiving, setStopReceiving] = useState(false);
  const balanceRef = useRef({ balance: 0, asset: 0 });
  const stopReceivingNumbers = () => {
    setStopReceiving(true);
  };

  const sendNumber = () => {
    socket.emit("send-message", { balance });
  };

  useEffect(() => {
    socket.on("receives-numbers", (data) => {
      if (!stopReceiving) {
        setbalanceReceive((prev) => [...prev, data.result]);
        balanceRef.current = data.result;
      }
    });
    return () => {
      socket.off("receives-numbers");
    };
  }, [stopReceiving]);

  return (
    <div>
      <input
        type='number'
        name='balance'
        placeholder='Hasan Balance'
        onChange={(event) =>
          setBalance((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
          }))
        }
      />
      <input
        placeholder='asset'
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
        <h3 key={index}>{number}</h3>
      ))}
    </div>
  );
};

export default App;
