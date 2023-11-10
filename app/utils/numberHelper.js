function isHex(str) {
  return Boolean(str.match(/^[0-9a-f]+$/i));
}

function isInt(value) {
  if (isNaN(value)) {
    return false;
  }
  var x = parseFloat(value);
  return (x | 0) === x;
}

module.exports = { isInt, isHex };
