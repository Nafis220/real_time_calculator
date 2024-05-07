let highestNumber = 0;
let lowestNumber = 10;
let startingNumberArray = [];
let highestNumberArray = [];
let lowestNUmberArray = [];

function getTheLatestDBData() {
  // get all the data from db here, the random data will be replaced by rate from database
  let randomNumber = Math.random();
  startingNumberArray.push(randomNumber);
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
    startingNumberArray: startingNumberArray,
  };
}

export default getTheLatestDBData;
