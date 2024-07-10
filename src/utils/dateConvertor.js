export function isoDateToShortDate(isoDate) {
  const date = new Date(isoDate)
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' }

  return date.toLocaleDateString('en-US', options)
}

const isoDate = '2024-06-28T15:02:07.010Z'
const shortDate = isoDateToShortDate(isoDate)

console.log(shortDate) // Output: "6/28/2024"
