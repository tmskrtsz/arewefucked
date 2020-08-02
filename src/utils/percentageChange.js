exports.percentageChange = (newNumber, oldNumber) => {
  if (typeof newNumber !== 'number'
    || typeof oldNumber !== 'number') {
    throw new Error('One of the supplied parameter is not a number.')
  }

  const increase = newNumber - oldNumber
  const percentage = increase / oldNumber * 100

  if (Math.sign(percentage) === -1) {
    return `${percentage.toFixed(2).toLocaleString()}%`
  }

  return `+${percentage.toFixed(2).toLocaleString()}%`
}
