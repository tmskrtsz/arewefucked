// Stolen from https://gist.github.com/tobyjsullivan/96d37ca0216adee20fa95fe1c3eb56ac

exports.abbrNumber = (value) => {
  let newValue = value
  const suffixes = ['', 'K', 'M', 'B','T']
  let suffixNum = 0

  while (newValue >= 1000) {
    newValue /= 1000
    suffixNum++
  }

  newValue = newValue.toPrecision(3)

  newValue += suffixes[suffixNum]
  return newValue
}
