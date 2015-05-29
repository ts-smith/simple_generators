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
  console.log('end child');
}

function* main() {

  console.log('start parent');
  yield P.delay(1000);
  yield arbitrary();

  console.log('end parent');
}

//pseudo synchronous reentry comes from coroutine handling yield results
co(function* () {
  
  var inner = main();

  var outer = middleWare(inner);

  console.log('starting handling request');
  //I thought this should need yield* instead of yield
  yield outer;
  console.log('done handling request');

}).catch(e => console.error(e));
