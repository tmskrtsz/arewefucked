export function formatNumber (number) {
  if (typeof number !== 'number') {
    throw new Error('Provided value is not of type number')
  }

  return number.toLocaleString()
}
