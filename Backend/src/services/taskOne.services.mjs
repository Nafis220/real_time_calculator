const taskOneCalculation = (balance, asset) => {
  const randomNumbers = [];
  for (let i = 0; i < 5; i++) {
    randomNumbers.push(Math.random());
  }

  const randomIndex = Math.floor(Math.random()) * 5;
  const plusOrMinus = Math.random() > 0.5 ? "plus" : "minus";
  const calculation = balance / asset;
  console.log(balance, asset);
  if (plusOrMinus === "plus") {
    return calculation + randomNumbers[randomIndex];
  } else {
    return calculation - randomNumbers[randomIndex];
  }
};

export { taskOneCalculation };
