function isNotDone(context, next) {
 const status = context.vars.statusId;
 const isStillProcessing = [1, 2].includes(status);
 return next(isStillProcessing);
}

function getRandomNumber(min, max) {
 return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTestCase(context, events, done) {
 let randomNumbers = [];
 const numberOfRandomNumbers = 1_000;
 const minRandomNumber = 1;
 const maxRandomNumber = 100;

 for (let i = 0; i < numberOfRandomNumbers; i++) {
  let randomNumber = getRandomNumber(minRandomNumber, maxRandomNumber);
  randomNumbers.push(randomNumber);
 }

 context.vars['input'] = randomNumbers.join(' ');
 context.vars['expected_output'] = randomNumbers
  .sort((a, b) => a - b)
  .join(' ');

 return done();
}

function logStatus(context, events, done) {
 const status = context.vars.statusId;
 events.emit('status', status);
 return done();
}

module.exports = {
 isNotDone: isNotDone,
 generateTestCase,
 logStatus,
};
