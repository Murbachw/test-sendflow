export const formatDate = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(date)
    : 'Nao definido'

export const toDate = (value: string) => (value ? new Date(value) : null)

export const toLocalDatetime = (date: Date | null) => {
  if (!date) {
    return ''
  }

  const timezoneOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}
