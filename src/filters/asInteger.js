export function formatInt(number) {
  return new Intl.NumberFormat('it-IT', {
    useGrouping: true,
    maximumFractionDigits: 0
  }).format(number)
}