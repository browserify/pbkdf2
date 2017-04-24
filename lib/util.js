function alloc (num) {
  if (Buffer.allocUnsafe) {
    return Buffer.allocUnsafe(num)
  }
  return new Buffer(num)
}

exports.alloc = alloc
