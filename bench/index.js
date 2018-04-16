var Benchmark = require('benchmark')
var current = require('../lib/sync')
var old = require('./old')

run('hello', 'world', 100, 32, 'md5')
run('hello', 'world', 100, 32, 'sha256')
run('hello', 'world', 10000, 70, 'md5')
run('hello', 'world', 10000, 70, 'sha256')
function run (password, salt, iterations, keylen, digest) {
  var suite = new Benchmark.Suite()
  console.log(`password: ${password}`)
  console.log(`salt: ${salt}`)
  console.log(`iterations: ${iterations}`)
  console.log(`keylen: ${keylen}`)
  console.log(`digest: ${digest}`)

  // add tests
  suite
    .add('current', function () {
      current(password, salt, iterations, keylen, digest)
    })
    .add('old', function () {
      old(password, salt, iterations, keylen, digest)
    })

    // add listeners
    .on('cycle', function (event) {
      console.log(String(event.target))
    })
    .on('complete', function () {
      console.log('Fastest is ' + this.filter('fastest').map('name'))
      console.log('')
    })
    .run()
}
