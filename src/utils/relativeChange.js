export function relativeChange (newNumber, oldNumber) {
  if (typeof newNumber !== 'number'
    || typeof oldNumber !== 'number') {
    throw new Error('One of the supplied parameter is not a number.')
  }

  const change = newNumber - oldNumber

  if (Math.sign(change) === -1) {
    return change.toLocaleString()
  }

  return `+${change.toLocaleString()}`
}
