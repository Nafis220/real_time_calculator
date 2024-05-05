let highestNumber = 0;
let lowestNumber = 10;
let highestNumberArray = [];
let lowestNUmberArray = [];
let randomNumber = 0;
function getTheLatestDBData() {
  // get all the data from db here, the random data will be replaced by rate from database
  randomNumber = Math.random();
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
  };
}

export default getTheLatestDBData;
