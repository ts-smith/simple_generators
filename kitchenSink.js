var P = require('bluebird');
var co = require('co');

function* middleWare(next) {
  console.log('start middleware ');
  yield P.delay(1000);
  yield next;
  console.log('end middleware ');
}

function* arbitrary() {

  console.log('start child');
  yield P.delay(1000);
  this.stateKey = 'stateValue';
  try {
    console.log('create error');
    yield* err();
  }
  catch (e) {
    console.log('error handled');
  }
  console.log('end child');
}

function* err() {
  throw up;
}

function* main() {

  var state = {};

  var bound = arbitrary.bind(state);

  console.log('start parent');
  yield P.delay(1000);
  yield bound();
  console.log(state);
  yield P.delay(1000);

  console.log('end parent');
}

co(function* () {
  
  var inner = main();

  var outer = middleWare(inner);

  console.log('starting handling request');
  yield* outer;
  console.log('done handling request');

}).catch(e => console.error(e));
