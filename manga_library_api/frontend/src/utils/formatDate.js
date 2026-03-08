function formatDate(value) {
  if (!value) return ""

  const raw = String(value).trim()
  const datePart = raw.split("T")[0]

  const parts = datePart.split("-")
  if (parts.length !== 3) return raw

  const [year, month, day] = parts

  const monthNames = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre"
  ]

  const monthIndex = Number(month) - 1
  if (monthIndex < 0 || monthIndex > 11) return raw

  return `${Number(day)} ${monthNames[monthIndex]} ${year}`
}

export default formatDate