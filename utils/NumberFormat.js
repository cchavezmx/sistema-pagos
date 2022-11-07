export const numberFormat = (amount) => {
  const format = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
  return format
}

export const dateFormat = (date) => {
  const date2 = new Date(Number(date))
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium'
  }).format(date2).toUpperCase()
}
