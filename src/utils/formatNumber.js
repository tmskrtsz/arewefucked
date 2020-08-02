exports.formatNumber = (number) => {
  if (typeof number !== 'number') {
    throw new Error(`Provided value, is ${typeof number}. Expected number`)
  }

  return number.toLocaleString()
}
