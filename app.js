const express = require('express');
const fs = require('fs');
const fsPromise = require('fs').promises;
const app = express();

const FILENAME = 'results.txt';

//###############################################
// routes

app.get('/mean', function(req, res) {
  //get query string and parse to array of ints

  let text;
  try {
    let numsArr = validateQueryParams(req.query.nums);
    let result = mean(numsArr);
    text = `The mean of ${req.query.nums} is ${result}\n`;

    //append to FILENAME
    writeToFile(text);
  } catch (err) {
    text = err;
    res.status(400).send(text);
  }

  //send string to client
  res.send(text);
});

app.get('/median', function(req, res) {
  let numsArr = validateQueryParams(req.query.nums);
  let result = median(numsArr);
  let text = `The median of ${req.query.nums} is ${result}\n`;

  //append to FILENAME
  writeToFile(text);

  //send string to client
  res.send(text);
});

app.get('/mode', function(req, res) {
  let numsArr = validateQueryParams(req.query.nums);
  let result = mode(numsArr);
  let text = `The mode of ${req.query.nums} is ${result}\n`;

  //append to FILENAME
  writeToFile(text);

  //send string to client
  res.send(text);
});

app.get('/result', function(req, res) {
  let data = readFromFile();
  data.then(response => {
    console.log('resp', response.split('\n'));
    res.send(response);
  });
});

//###############################################
// helper functions

function mean(nums) {
  return nums.reduce((a, v) => a + v) / nums.length;
}

function median(nums) {
  let median;
  if (nums.length % 2 === 0)
    median = (nums[nums.length / 2] + nums[nums.length / 2 - 1]) / 2;
  else median = nums[Math.floor(nums.length / 2)];
  return median;
}

function mode(nums) {
  let counter = {};

  for (let num of nums) {
    counter[num] = counter[num] + 1 || 0;
  }

  let highest = 0;
  let mode;

  for (let key in counter) {
    if (counter[key] > highest) {
      highest = counter[key];
      mode = key;
    }
  }

  return mode;
}

function validateQueryParams(params) {
  // check for empty query parameters
  if (!params) {
    console.log('too short');
    throw 'Error: nums are required';
  }

  // check leading char is digit
  if (isNaN(params[0]))
    throw 'Error: Query string must contain only numbers separated by commas';

  // split params into array
  params = params.split(','); // <= ['1','2','3']

  // check if every item in array is a number
  for (let param of params) {
    if (isNaN(param)) throw `Error: "${param}" is not a number`;
  }

  // return an array of numbers
  return params.map(num => +num);
}

function writeToFile(text) {
  fs.appendFile(FILENAME, text, 'utf8', err => {
    if (err) console.error(err.message);
    else console.log('Wrote to file');
  });
}

async function readFromFile() {
  let data = await fsPromise.readFile(FILENAME, 'utf8', function(err, data) {
    return data;
  });
  // console.log(data);
  return data;
}

//###############################################
// start server

app.listen(3000, () => console.log('Server started'));
