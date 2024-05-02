import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
const socket = io.connect("http://localhost:3000");
const App = () => {
  const [balance, setBalance] = useState({ balance: 0, asset: 0 });
  const [balanceReceive, setbalanceReceive] = useState([]);
  const [stopReceiving, setStopReceiving] = useState(false);
  const balanceRef = useRef({ balance: 0, asset: 0 });
  const [newBalance, setNewBalance] = useState(1000);
  const [profitOrLoss, setProfitOrLoss] = useState(0);
  const [totalCalculation, setTotalCalculation] = useState(0);
  const stopReceivingNumbers = () => {
    setStopReceiving(true);
  };

  const sendNumber = () => {
    socket.emit("send-message", { balance });
  };
  socket.on("balance-count", (data, calculation) => {
    let newBalance = Number(data);
    let newCalculation = Number(calculation);

    setBalance(newBalance);
    setTotalCalculation(newCalculation);
  });
  // new balance  sending
  const updatebalance = (incrementOrDecrement, amount) => {
    if (incrementOrDecrement === "plus") {
      setNewBalance((prev) => Number(prev) + Number(amount));
    } else {
      setNewBalance((prev) => Number(prev) - Number(amount));
    }
  };
  useEffect(() => {
    socket.emit("send-balance", newBalance);
  }, [newBalance]);
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
      <input
        type='number'
        placeholder='how much profit or loss  happened ?'
        value={profitOrLoss}
        onChange={(e) => {
          setProfitOrLoss(e.target.value);
        }}
      />{" "}
      <button
        onClick={() => {
          updatebalance("plus", profitOrLoss);
        }}
      >
        +
      </button>{" "}
      <button
        onClick={() => {
          updatebalance("minus", profitOrLoss);
        }}
      >
        -
      </button>{" "}
      <h2>{newBalance} / 500</h2>
      <h3>Result = {totalCalculation}</h3>
    </div>
  );
};

export default App;
