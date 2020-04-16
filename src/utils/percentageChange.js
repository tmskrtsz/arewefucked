export function percentageChange (newNumber, oldNumber) {
  if (typeof newNumber !== 'number'
    || typeof oldNumber !== 'number') {
    throw new Error('One of the supplied parameter is not a number.')
  }

  const increase = newNumber - oldNumber
  const percentage = increase / oldNumber * 100

  return `${percentage.toFixed(2).toLocaleString()}%`
}
